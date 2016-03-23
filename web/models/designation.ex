defmodule Nvlp.Designation do
  use Nvlp.Web, :model

  schema "designations" do
    field :amount_cents, :integer
    belongs_to :envelope, Nvlp.Envelope
    belongs_to :transaction, Nvlp.Transaction

    timestamps
  end

  @required_fields ~w(amount_cents envelope_id)
  @optional_fields ~w()

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
