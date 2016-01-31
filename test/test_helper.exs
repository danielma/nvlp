ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Envelope.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Envelope.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Envelope.Repo)

