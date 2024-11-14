# Installare JSON SERVER

1. npm install -g json-server
2. crea un file db.json nella root

```json
{
  "todos": [
    { "id": 1, "title": "Impara React", "completed": false },
    { "id": 2, "title": "Crea una CRUD", "completed": false }
  ]
}
```

3. json-server --watch db.json --port 5000
