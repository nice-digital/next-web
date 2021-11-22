workspace {
	
    model {
		niceLogging = softwaresystem "NICE Logging"
		guidanceWeb = softwaresystem "Guidance Web"
		niceOrg = softwaresystem "Niceorg"
		nextWeb = softwaresystem "Next Web"

		ocelotAPI = softwaresystem "Ocelot API" {
			ocelotdotnet = container "Ocelot API web application" "dotnet Core"
			redis = container "Response Cache" "Redis/Elasticache" "Redis" "Database"
			ocelotRoutesConfig = container "ocelot.json config" "Route config" "json" "Jsonfile"
			taskScheduler = container "Task Scheduler" "Task Scheduler" "IHosted Service"

			ocelotdotnet -> redis "Caches data in" "Redis Protocol"
			ocelotRoutesConfig -> ocelotdotnet "Reads route data from"
			taskScheduler -> ocelotdotnet "Refreshes specific cached content" "HTTP"
			ocelotdotnet -> niceLogging "Sinks error logs to" "RabbitMQ"
			guidanceWeb -> ocelotdotnet "Requests content from" "HTTP"
			nextWeb -> ocelotdotnet "Requests content from" "HTTP"
			ocelotdotnet ->  niceorg "Requests content from" "HTTP"
		}
    }

    views {
		container ocelotAPI "Containers" {
			include *
		}
		styles {
            element "Database" {
                shape Cylinder
            }
			element "Jsonfile" {
                shape Folder
            }
		}
		theme default
    }
}
