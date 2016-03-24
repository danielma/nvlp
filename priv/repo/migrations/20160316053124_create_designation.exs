defmodule Nvlp.Repo.Migrations.CreateDesignation do
  use Ecto.Migration

  def change do
    create table(:designations) do
      add :amount_cents, :integer
      add :envelope_id, references(:envelopes, on_delete: :nothing)
      add :transaction_id, references(:transactions, on_delete: :nothing)

      timestamps
    end
    create index(:designations, [:envelope_id])
    create index(:designations, [:transaction_id])

  end
end
