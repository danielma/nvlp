defmodule Nvlp.Transaction do
  use Nvlp.Web, :model

  schema "transactions" do
    field :payee, :string
    field :designated, :boolean, default: false
    field :posted_at, Ecto.DateTime
    field :institution_id, :integer
    field :amount_cents, :integer
    field :memo, :string
    belongs_to :account, Nvlp.Account
    has_many :designations, Nvlp.Designation

    timestamps
  end

  @required_fields ~w(payee designated posted_at institution_id amount_cents memo)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> cast_assoc(:designations, required: true)
  end
end
