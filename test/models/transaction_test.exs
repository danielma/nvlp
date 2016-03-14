defmodule Nvlp.TransactionTest do
  use Nvlp.ModelCase

  alias Nvlp.Transaction

  @valid_attrs %{amount_cents: 42, designated: true, institution_id: 42, memo: "some content", payee: "some content", posted_at: "2010-04-17 14:00:00"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Transaction.changeset(%Transaction{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Transaction.changeset(%Transaction{}, @invalid_attrs)
    refute changeset.valid?
  end
end
