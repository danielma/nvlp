defmodule Nvlp.Repo.Migrations.CreateEnvelope do
  use Ecto.Migration

  def change do
    create table(:envelopes) do
      add :amount_cents, :integer
      add :name, :string

      timestamps
    end

  end
end
