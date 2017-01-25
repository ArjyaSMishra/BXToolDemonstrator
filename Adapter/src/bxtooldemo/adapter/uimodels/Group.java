package bxtooldemo.adapter.uimodels;

import java.util.List;

/**
 * @author Arjya Shankar Mishra
 *
 */
public class Group {
	
	private List<Rectangle> blocks;
	private String fillColor;

	/**
	 * @return the blocks
	 */
	public List<Rectangle> getBlocks() {
		return blocks;
	}

	/**
	 * @param blocks the blocks to set
	 */
	public void setBlocks(List<Rectangle> blocks) {
		this.blocks = blocks;
	}

	/**
	 * @return the fillColor
	 */
	public String getFillColor() {
		return fillColor;
	}

	/**
	 * @param fillColor the fillColor to set
	 */
	public void setFillColor(String fillColor) {
		this.fillColor = fillColor;
	}

}
