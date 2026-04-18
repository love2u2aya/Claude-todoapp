# Claude Code Instructions

## スキル（カスタムスラッシュコマンド）の管理

新しいスキルを作成したときは、必ず以下の手順を行う：

1. スキルファイルを `.claude/commands/` に保存する（`~/.claude/commands/` ではなく）
2. GitHubにコミット＆プッシュする

```bash
git add .claude/commands/
git commit -m "add skill: <スキル名>"
git push -u origin <ブランチ名>
```

これにより、別のマシンやチームメンバーと同じスキルを共有できる。
