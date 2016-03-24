defmodule Nvlp.Envelope do
  use Nvlp.Web, :model

  schema "envelopes" do
    field :amount_cents, :integer, default: 0
    field :name, :string

    timestamps
  end

  @required_fields ~w(name)
  @optional_fields ~w(amount_cents)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
