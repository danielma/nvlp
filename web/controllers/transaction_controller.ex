defmodule Nvlp.TransactionController do
  use Nvlp.Web, :controller

  alias Nvlp.Transaction

  import Ecto.Query, only: [from: 2]

  plug :scrub_params, "transaction" when action in [:create, :update]

  def index(conn, params) do
    if params[:designated] do
      query = from t in Transaction, where: t.designated == false
      render(conn, "index.json", transactions: Repo.all(query))
    else
      transactions = Repo.all(Transaction)
      render(conn, "index.json", transactions: transactions)
    end
  end

  def create(conn, %{"transaction" => transaction_params}) do
    changeset = Transaction.changeset(%Transaction{}, transaction_params)

    case Repo.insert(changeset) do
      {:ok, transaction} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", transaction_path(conn, :show, transaction))
        |> render("show.json", transaction: transaction)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Nvlp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    transaction = Repo.get!(Transaction, id)
    render(conn, "show.json", transaction: transaction)
  end

  def update(conn, %{"id" => id, "transaction" => transaction_params}) do
    transaction = Repo.get!(Transaction, id)
    changeset = Transaction.changeset(transaction, transaction_params)

    case Repo.update(changeset) do
      {:ok, transaction} ->
        render(conn, "show.json", transaction: transaction)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Nvlp.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    transaction = Repo.get!(Transaction, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(transaction)

    send_resp(conn, :no_content, "")
  end
end
