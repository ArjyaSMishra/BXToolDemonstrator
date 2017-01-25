package bxtooldemo.adapter.uimodels;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Arjya Shankar Mishra
 *
 */
public class Change {
	
	private List<Circle> created;
	private List<Circle> deleted;
	private List<Circle> moved;
	/**
	 * @return the created
	 */
	public List<Circle> getCreated() {
		return created;
	}
	/**
	 * @param created the created to set
	 */
	public void setCreated(List<Circle> created) {
		this.created = created;
	}
	/**
	 * @return the deleted
	 */
	public List<Circle> getDeleted() {
		return deleted;
	}
	/**
	 * @param deleted the deleted to set
	 */
	public void setDeleted(List<Circle> deleted) {
		this.deleted = deleted;
	}
	/**
	 * @return the moved
	 */
	public List<Circle> getMoved() {
		return moved;
	}
	/**
	 * @param moved the moved to set
	 */
	public void setMoved(List<Circle> moved) {
		this.moved = moved;
	}

}
