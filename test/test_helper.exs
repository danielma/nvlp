ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Nvlp.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Nvlp.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Nvlp.Repo)

