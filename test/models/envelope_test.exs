defmodule Envelope.EnvelopeTest do
  use Envelope.ModelCase

  alias Envelope.Envelope

  @valid_attrs %{amount_cents: "some content", name: "some content"}
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
