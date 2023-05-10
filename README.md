# Dream Team Check-In

A check-in/out app for the Des Moines Dream Team's rides.

## Releasing

To release a new version of the app, [create a new GitHub release](https://github.com/DreamTeamDSM/DreamTeamCheckIn/releases). Once created, GitHub Actions will automatically [begin a workflow to deploy to GitHub Pages](https://github.com/DreamTeamDSM/DreamTeamCheckIn/actions/workflows/release-github-pages.yml). Additionally, the workflow will "stamp" the version to the bottom of the app with a link to the release in GitHub, so the user can easily tell which version they have installed and can view release notes for that version.