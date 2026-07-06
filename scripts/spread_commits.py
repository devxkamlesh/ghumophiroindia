#!/usr/bin/env python3
"""
Spread all commits on a branch across a fixed window of days, with a natural
random number of commits per day, and set a fixed author/committer identity.

SAFE METHOD: uses `git fast-export | transform | git fast-import`.
Only TWO git processes run (export + import) instead of one process PER commit
like the deprecated `git filter-branch`. This avoids the CPU/heat storm that
caused reboots.

Usage (defaults shown):
  python scripts/spread_commits.py \
      --start 2026-01-04 --days 35 --min-per-day 2 --seed 42 \
      --name devxkamlesh --email kamleshgchoudhary007@gmail.com

Nothing is pushed. After it runs and you verify:
  git push --force-with-lease origin <branch>
Undo at any time:
  git reset --hard backup-before-date-rewrite
"""

import argparse
import datetime as dt
import os
import random
import subprocess
import sys
import tempfile

TZ = "+0530"            # India; the contribution-graph day is bucketed by this
TZ_OFFSET_SECONDS = 5 * 3600 + 30 * 60


def run(args, **kw):
    return subprocess.run(args, check=True, text=True, capture_output=True, **kw)


def git_out(args):
    return run(["git"] + args).stdout.strip()


def build_distribution(count, days, min_per_day, seed):
    if days < 1:
        sys.exit("days must be >= 1")
    if days * min_per_day > count:
        sys.exit(f"days*min_per_day ({days*min_per_day}) exceeds commits ({count})")
    rng = random.Random(seed) if seed else random.Random()
    per_day = [min_per_day] * days
    for _ in range(count - days * min_per_day):
        per_day[rng.randrange(days)] += 1
    return per_day


def build_date_list(base, per_day):
    """Return a list of length sum(per_day): one datetime per commit, ascending."""
    dates = []
    for d, k in enumerate(per_day):
        day = base + dt.timedelta(days=d)
        for j in range(k):
            total_min = 540 + int(j * (720.0 / max(k, 1))) + (j % 5)  # 09:00-21:00
            hh = total_min // 60
            mm = total_min % 60
            ss = (len(dates) * 13) % 60
            dates.append(day.replace(hour=hh, minute=mm, second=ss))
    return dates


def to_epoch(naive_local):
    """Treat naive datetime as wall-clock in TZ, return UTC epoch seconds."""
    epoch_naive = int((naive_local - dt.datetime(1970, 1, 1)).total_seconds())
    return epoch_naive - TZ_OFFSET_SECONDS


def transform(raw, dates, name, email):
    """Binary-safe rewrite of author/committer lines in a fast-export stream."""
    name_b = name.encode()
    email_b = email.encode()
    out = bytearray()
    i, n = 0, len(raw)
    commit_index = -1

    def ident(prefix, idx):
        d = dates[idx] if idx < len(dates) else dates[-1]
        ep = to_epoch(d)
        return b"%s %s <%s> %d %s\n" % (prefix, name_b, email_b, ep, TZ.encode())

    while i < n:
        j = raw.find(b"\n", i)
        if j == -1:
            out += raw[i:]
            break
        line = raw[i:j]
        nxt = j + 1

        if line.startswith(b"data "):
            spec = line[5:]
            if spec.startswith(b"<<"):
                # delimited form: copy until a line equal to the delimiter
                delim = spec[2:]
                out += raw[i:nxt]
                i = nxt
                while i < n:
                    k = raw.find(b"\n", i)
                    if k == -1:
                        out += raw[i:]
                        i = n
                        break
                    seg = raw[i:k]
                    out += raw[i:k + 1]
                    i = k + 1
                    if seg == delim:
                        break
                continue
            else:
                cnt = int(spec)
                out += raw[i:nxt]              # "data N\n"
                out += raw[nxt:nxt + cnt]      # raw payload, untouched
                i = nxt + cnt
                continue

        if line.startswith(b"commit "):
            commit_index += 1
            out += raw[i:nxt]
            i = nxt
            continue

        if line.startswith(b"author "):
            out += ident(b"author", commit_index)
            i = nxt
            continue

        if line.startswith(b"committer "):
            out += ident(b"committer", commit_index)
            i = nxt
            continue

        out += raw[i:nxt]
        i = nxt

    return bytes(out)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--start", default="2026-01-04")
    p.add_argument("--days", type=int, default=35)
    p.add_argument("--min-per-day", type=int, default=2)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--name", default="devxkamlesh")
    p.add_argument("--email", default="kamleshgchoudhary007@gmail.com")
    p.add_argument("--branch", default="")
    args = p.parse_args()

    # Safety: no in-progress rebase/merge
    git_dir = git_out(["rev-parse", "--git-dir"])
    if os.path.exists(os.path.join(git_dir, "rebase-merge")) or \
       os.path.exists(os.path.join(git_dir, "MERGE_HEAD")):
        sys.exit("Rebase/merge in progress. Resolve or abort it first.")

    branch = args.branch or git_out(["branch", "--show-current"])
    if not branch:
        sys.exit("Detached HEAD. Checkout a branch first.")

    hashes = git_out(["log", branch, "--reverse", "--pretty=format:%H"]).splitlines()
    count = len(hashes)
    if count == 0:
        sys.exit("No commits.")

    base = dt.datetime.strptime(args.start, "%Y-%m-%d")
    per_day = build_distribution(count, args.days, args.min_per_day, args.seed)
    dates = build_date_list(base, per_day)
    assert len(dates) == count, (len(dates), count)

    print(f"Branch : {branch}")
    print(f"Author : {args.name} <{args.email}>")
    print(f"Commits: {count} -> Days: {args.days} (avg {count/args.days:.1f}/day)")

    # Backup branch (reversible)
    run(["git", "branch", "-f", "backup-before-date-rewrite", branch])
    print("Backup : backup-before-date-rewrite created")

    # Repo identity for future commits too
    run(["git", "config", "user.name", args.name])
    run(["git", "config", "user.email", args.email])

    tmpdir = tempfile.mkdtemp(prefix="spread_")
    export_path = os.path.join(tmpdir, "export.dat")

    # Export (single process). --no-data would break re-import, so keep data.
    with open(export_path, "wb") as f:
        subprocess.run(
            ["git", "fast-export", "--reencode=yes", "--signed-tags=strip",
             "--tag-of-filtered-object=drop", branch],
            check=True, stdout=f,
        )

    with open(export_path, "rb") as f:
        raw = f.read()

    new_stream = transform(raw, dates, args.name, args.email)

    # Import (single process)
    proc = subprocess.run(
        ["git", "fast-import", "--force", "--quiet"],
        input=new_stream,
    )
    if proc.returncode != 0:
        sys.exit("fast-import failed. Your branch is unchanged; backup is intact.")

    # Make working tree match rewritten history (content is identical)
    run(["git", "reset", "--hard", branch])

    # Verify
    out_dates = git_out(["log", branch, "--pretty=format:%ad", "--date=format:%Y-%m-%d"]).splitlines()
    distinct = sorted(set(out_dates))
    from collections import Counter
    c = Counter(out_dates)
    print("\nResult:")
    print(f"  total commits : {len(out_dates)}")
    print(f"  days used     : {len(distinct)} ({distinct[0]} .. {distinct[-1]})")
    print(f"  max/day       : {max(c.values())}, min/day: {min(c.values())}")
    print("\nPer-day distribution:")
    for d in distinct:
        print(f"  {d}: {c[d]}")
    print(f"\nPublish: git push --force-with-lease origin {branch}")
    print("Undo:    git reset --hard backup-before-date-rewrite")


if __name__ == "__main__":
    main()
