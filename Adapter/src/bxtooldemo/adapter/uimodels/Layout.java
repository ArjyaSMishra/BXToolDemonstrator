package bxtooldemo.adapter.uimodels;

import java.util.List;

/**
 * @author Arjya Shankar Mishra
 *
 */
public class Layout extends Canvas {
	
	private double gridSize;
	private List<Rectangle> blocks;
	private List<Group> groups;
	
	public Layout(){
		super(500, 500);
	}

	/**
	 * @return the gridSize
	 */
	public double getGridSize() {
		return gridSize;
	}

	/**
	 * @param gridSize the gridSize to set
	 */
	public void setGridSize(double gridSize) {
		this.gridSize = gridSize;
	}

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
	 * @return the groups
	 */
	public List<Group> getGroups() {
		return groups;
	}

	/**
	 * @param groups the groups to set
	 */
	public void setGroups(List<Group> groups) {
		this.groups = groups;
	}

}
