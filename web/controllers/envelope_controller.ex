defmodule Nvlp.EnvelopeController do
  use Nvlp.Web, :controller

  alias Nvlp.Envelope

  plug :scrub_params, "envelope" when action in [:create, :update]

  def index(conn, _params) do
    envelopes = Repo.all(Envelope)
    render(conn, "index.json", envelopes: envelopes)
  end

  def create(conn, %{"envelope" => envelope_params}) do
    changeset = Envelope.changeset(%Envelope{}, envelope_params)

    case Repo.insert(changeset) do
      {:ok, envelope} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", envelope_path(conn, :show, envelope))
        |> render("show.json", envelope: envelope)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Nvlp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    envelope = Repo.get!(Envelope, id)
    render(conn, "show.json", envelope: envelope)
  end

  def update(conn, %{"id" => id, "envelope" => envelope_params}) do
    envelope = Repo.get!(Envelope, id)
    changeset = Envelope.changeset(envelope, envelope_params)

    case Repo.update(changeset) do
      {:ok, envelope} ->
        render(conn, "show.json", envelope: envelope)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Nvlp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    envelope = Repo.get!(Envelope, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(envelope)

    send_resp(conn, :no_content, "")
  end
end
