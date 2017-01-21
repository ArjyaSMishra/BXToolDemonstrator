package bxtooldemo.ui.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Observable;
import java.util.Observer;

import bxtooldemo.ui.models.Canvas;

public class ClientObservable extends Observable {
	
	   private List<Observer> observers = new ArrayList<Observer>();
	   private Canvas canvas;

	   public Canvas getCanvas() {
	      return canvas;
	   }

	   public void setCanvas(Canvas canvas) {
	      this.canvas = canvas;
	      notifyAllObservers();
	      System.out.println("after notify from observable");
	   }

	   public void attach(Observer observer){
	      observers.add(observer);		
	   }

	   public void notifyAllObservers(){
		   System.out.println("inside notify from observable");
	      for (Observer observer : observers) {
	         observer.update(this, null);
	      }
	   } 	

}
