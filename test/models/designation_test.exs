defmodule Nvlp.DesignationTest do
  use Nvlp.ModelCase

  alias Nvlp.Designation

  @valid_attrs %{amount_cents: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Designation.changeset(%Designation{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Designation.changeset(%Designation{}, @invalid_attrs)
    refute changeset.valid?
  end
end
