defmodule Nvlp.DesignationController do
  use Nvlp.Web, :controller

  alias Nvlp.Designation

  plug :scrub_params, "designation" when action in [:create, :update]

  def index(conn, %{"envelope_id" => envelope_id}) do
    designations = Repo.all(from d in Designation,
                            where: d.envelope_id == ^(envelope_id),
                            preload: [:transaction])
    render(conn, "index.json", designations: designations)
  end

  def index(conn, _params) do
    designations = Repo.all(from d in Designation, preload: [:transaction])
    render(conn, "index.json", designations: designations)
  end

  def create(conn, %{"designation" => designation_params}) do
    changeset = Designation.changeset(%Designation{}, designation_params)

    case Repo.insert(changeset) do
      {:ok, designation} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", designation_path(conn, :show, designation))
        |> render("show.json", designation: designation)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Nvlp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    designation = Repo.get!(Designation, id)
    render(conn, "show.json", designation: designation)
  end

  def update(conn, %{"id" => id, "designation" => designation_params}) do
    designation = Repo.get!(Designation, id)
    changeset = Designation.changeset(designation, designation_params)

    case Repo.update(changeset) do
      {:ok, designation} ->
        render(conn, "show.json", designation: designation)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Nvlp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    designation = Repo.get!(Designation, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(designation)

    send_resp(conn, :no_content, "")
  end
end
