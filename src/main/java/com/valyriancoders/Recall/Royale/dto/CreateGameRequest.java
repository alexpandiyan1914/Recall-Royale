package com.valyriancoders.Recall.Royale.dto;

import com.valyriancoders.Recall.Royale.model.GameMode;

public class CreateGameRequest {
    public int rows;   // 6 or 9
    public int cols;   // 6 or 9
    public GameMode mode; // LETTERS or IMAGES
}
