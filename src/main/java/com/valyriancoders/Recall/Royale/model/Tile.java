package com.valyriancoders.Recall.Royale.model;

public class Tile {
    private int index;
    private String key;      // e.g., "A", "car_07"
    private boolean matched; // permanently open
    private boolean faceUp;  // currently shown
    private boolean blocked; // for 9x9 single unusable tile

    public Tile(int index, String key, boolean blocked) {
        this.index = index;
        this.key = key;
        this.blocked = blocked;
    }
    public int getIndex() { return index; }
    public String getKey() { return key; }
    public boolean isMatched() { return matched; }
    public boolean isFaceUp() { return faceUp; }
    public boolean isBlocked() { return blocked; }
    public void setMatched(boolean matched) { this.matched = matched; }
    public void setFaceUp(boolean faceUp) { this.faceUp = faceUp; }
}
