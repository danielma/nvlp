defmodule Nvlp.Repo.Migrations.CreateEnvelope do
  use Ecto.Migration

  def change do
    create table(:envelopes) do
      add :amount_cents, :string
      add :name, :string

      timestamps
    end

  end
end
