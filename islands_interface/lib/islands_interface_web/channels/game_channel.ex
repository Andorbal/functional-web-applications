defmodule IslandsInterfaceWeb.GameChannel do
  use IslandsInterfaceWeb, :channel

  alias IslandsEngine.{Game, GameSupervisor, Island}

  def join("game:" <> _player, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("hello", payload, socket) do
    #push socket, "said_hello", payload
    broadcast! socket, "said_hello", payload
    {:noreply, socket}
  end

  def handle_in("new_game", _payload, socket) do
    "game:" <> player = socket.topic

    case GameSupervisor.start_game(player) do
      {:ok, _pid} -> {:reply, :ok, socket}
      {:error, reason} -> {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end

  def handle_in("add_player", player, socket) do
    case Game.add_player(via(socket.topic), player) do
      :ok ->
        broadcast! socket, "player_added", %{message: "New player just joined: " <> player}
        {:noreply, socket}
      {:error, reason} ->
        {:reply, {:error, %{reason: inspect(reason)}}, socket}
    end
  end

  def handle_in("position_island", payload, socket) do
    Island.types
    %{"player" => player, "island" => island, "row" => row, "col" => col} = payload

    player = String.to_existing_atom(player)
    island = String.to_existing_atom(island)

    case Game.position_island(via(socket.topic), player, island, row, col) do
      :ok -> {:reply, :ok, socket}
      :error -> {:reply, :error, socket}
    end
  end

  def handle_in("set_islands", player, socket) do
    player = String.to_existing_atom(player);

    case Game.set_islands(via(socket.topic), player) do
      {:ok, board} ->
        broadcast! socket, "player_set_islands", %{player: player}
        {:reply, {:ok, %{board: board}}, socket}
      :error -> {:reply, :error, socket}
      {:error, reason} -> {:reply, {:error, %{reson: inspect(reason)}}, socket}
    end
  end

  defp via("game:" <> player), do: Game.via_tuple(player)
end
