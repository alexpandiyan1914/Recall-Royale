package com.valyriancoders.Recall.Royale.model;

import java.util.*;

public class Game {
    private GameStatus status = GameStatus.LOBBY;
    private GameMode mode = GameMode.LETTERS;
    private int rows = 6;
    private int cols = 6;

    private final List<Player> players = new ArrayList<>();
    private final List<Tile> tiles = new ArrayList<>();

    private int currentPlayerIdx = 0;
    private Integer firstPickIndex = null;            // remembers first card of the turn
    private int[] pendingHide = null;                 // mismatched pair to hide after short delay

    public GameStatus getStatus() { return status; }
    public GameMode getMode() { return mode; }
    public int getRows() { return rows; }
    public int getCols() { return cols; }
    public List<Player> getPlayers() { return players; }
    public List<Tile> getTiles() { return tiles; }
    public int getCurrentPlayerIdx() { return currentPlayerIdx; }
    public Integer getFirstPickIndex() { return firstPickIndex; }
    public int[] getPendingHide() { return pendingHide; }

    public void setStatus(GameStatus status) { this.status = status; }
    public void setMode(GameMode mode) { this.mode = mode; }
    public void setBoardSize(int r, int c) { this.rows = r; this.cols = c; }
    public void setCurrentPlayerIdx(int idx) { this.currentPlayerIdx = idx; }
    public void setFirstPickIndex(Integer i) { this.firstPickIndex = i; }
    public void setPendingHide(int[] p) { this.pendingHide = p; }

    public boolean allMatched() {
        for (Tile t : tiles) {
            if (!t.isBlocked() && !t.isMatched()) return false;
        }
        return true;
    }
}
