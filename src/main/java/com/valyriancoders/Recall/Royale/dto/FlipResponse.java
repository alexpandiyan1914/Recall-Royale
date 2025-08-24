package com.valyriancoders.Recall.Royale.dto;

import com.valyriancoders.Recall.Royale.model.Game;

public class FlipResponse {
    public String action; // FIRST | MATCH | MISMATCH | BLOCKED | IGNORED
    public int[] indices; // involved tiles
    public Game state;    // latest state snapshot

    public FlipResponse(String action, int[] indices, Game state) {
        this.action = action; this.indices = indices; this.state = state;
    }
}
