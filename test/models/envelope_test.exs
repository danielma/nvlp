defmodule Nvlp.EnvelopeTest do
  use Nvlp.ModelCase

  alias Nvlp.Envelope

  @valid_attrs %{amount_cents: "100", name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Envelope.changeset(%Envelope{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Envelope.changeset(%Envelope{}, @invalid_attrs)
    refute changeset.valid?
  end
end
