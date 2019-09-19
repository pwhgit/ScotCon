# Delivering Intelligent Web Apps using ArcGIS
Source code from this presentation at the Scottish Conference on the 8th October 2019 in Perth.

<h1>Demo0.html</h1>
This file provides a simple mock up of a HMO licencing application built using bootstrap. 
This application is just provided as a bas umpon which I can illustrate the addition Spatial Inteligence to an existing application. This could equqlly be any package (i.e. sharepoint, dynamics, salesforce, etc) that allows custom code snippets, or any custom web application.

<h1>Demo1.html</h1>
Provides an example of adding a spatial (point in polygon) search fired by an event. In this case it will check if the address selected in the address search is within the sunnyshire boundary.

<h1>Demo2.html</h1>
Further extends this to show how you might embed a map hosted in ArcGIS online or Portal.
It also shows another example of spatial query. In this case it creates a 500m buffer around the selected address and then counts HMO propoerties and addressses, then presents some statistics to the user.

