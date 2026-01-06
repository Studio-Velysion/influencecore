# Contribuer à InfluenceCore (process simple)

## Règle d’or (suivi)
- **Chaque patch = une Issue GitHub** (Bug / Feature / Patch / Deploy).
- La PR (ou le commit) doit **référencer l’Issue**: `#123`.

## Automation (Issues auto)
- Sur la branche `develop`, une **Issue “Progress” est créée automatiquement à chaque push** via GitHub Actions.
- Pour désactiver exceptionnellement sur un commit: ajoute `\[no-issue]` dans le message de commit.

## Workflow recommandé
1. **Créer une Issue** avec le bon template.
2. Créer une branche: `issue-123-court-resume`.
3. Commit(s) clairs (petits lots).
4. Ouvrir une PR avec le template (lier l’Issue).
5. Merge → Coolify rebuild.

## Conventions de commit
- Préfixes recommandés: `fix:`, `feat:`, `chore:`, `docs:`, `refactor:`
- Exemple: `fix(auth): remove trustHost (next-auth v4) (#123)`


