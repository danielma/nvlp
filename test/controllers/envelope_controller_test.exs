defmodule Envelope.EnvelopeControllerTest do
  use Envelope.ConnCase

  alias Envelope.Envelope
  @valid_attrs %{amount_cents: "some content", name: "some content"}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, envelope_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    envelope = Repo.insert! %Envelope{}
    conn = get conn, envelope_path(conn, :show, envelope)
    assert json_response(conn, 200)["data"] == %{"id" => envelope.id,
      "amount_cents" => envelope.amount_cents,
      "name" => envelope.name}
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, envelope_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, envelope_path(conn, :create), envelope: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Envelope, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, envelope_path(conn, :create), envelope: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    envelope = Repo.insert! %Envelope{}
    conn = put conn, envelope_path(conn, :update, envelope), envelope: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Envelope, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    envelope = Repo.insert! %Envelope{}
    conn = put conn, envelope_path(conn, :update, envelope), envelope: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    envelope = Repo.insert! %Envelope{}
    conn = delete conn, envelope_path(conn, :delete, envelope)
    assert response(conn, 204)
    refute Repo.get(Envelope, envelope.id)
  end
end
