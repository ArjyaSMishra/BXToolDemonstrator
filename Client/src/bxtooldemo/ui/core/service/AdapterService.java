package bxtooldemo.ui.core.service;

import java.util.List;

import bxtooldemo.ui.core.datastructures.Delta;
import bxtooldemo.ui.models.Layout;
import bxtooldemo.ui.models.UIModels;
import bxtooldemo.ui.models.Workspace;

public abstract class AdapterService {
	
	public Layout layout;
	public Workspace workspace;

	public void setUIModels(Layout layout, Workspace workspace){
		this.layout = layout;
		this.workspace = workspace;
		
		System.out.println("Inside setuimodel of Client");
		System.out.println(this.layout);
	}
	
	public abstract void propagateDelta(List<Delta> changes);
	
	public abstract void initModels();
	
//	public void getUIData();
}
