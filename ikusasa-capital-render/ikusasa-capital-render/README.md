# Ikusasa Capital

Multi-page corporate website for Ikusasa Capital, covering investment advisory,
capital solutions, process engineering, market intelligence, and strategic
partnerships.

## Render deployment

This repository is configured as a Render Blueprint.

- Service type: Static Site
- Build command: `echo "Static site ready"`
- Publish directory: `./dist`
- Auto-deploy: every commit to the linked branch

In Render, choose **New → Blueprint**, connect this repository, and deploy the
`render.yaml` file from the repository root.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000`.

