defmodule Nvlp.Repo.Migrations.CreateTransaction do
  use Ecto.Migration

  def change do
    create table(:transactions) do
      add :payee, :string
      add :designated, :boolean, default: false
      add :posted_at, :datetime
      add :institution_id, :integer
      add :amount_cents, :integer
      add :memo, :string
      add :account_id, references(:accounts, on_delete: :nilify_all)

      timestamps
    end
    create index(:transactions, [:account_id])

  end
end
