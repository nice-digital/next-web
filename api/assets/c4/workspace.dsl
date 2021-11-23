workspace {

    model {
		niceLogging = softwaresystem "NICE Logging" "Rabbit, Logstash, Elastic and Kibana logging solution"
		guidanceWeb = softwaresystem "Guidance Web" "Only Niceorg endpoints currently routed by Ocelot"
		niceOrg = softwaresystem "Niceorg" "Main Nice website CMS"
		nextWeb = softwaresystem "Next Web" "Not currently implemented" "Disabled"

		ocelotAPI = softwaresystem "Next Web API" {
			nextWebApi = container "Next Web API Web Application" "dotnet Core" {
				ocelotRoutesConfig = component "ocelot.env.json config" "Stores Ocelot route config in json file which is read on application startup" "json" "Json file"
				taskScheduler = component "Task Scheduler" "Internal task scheduler makes requests to Ocelot via HTTP. Urls and cron times are stored in code. Scheduler only starts when a valid request has been received and continues until the application pool is restarted " "IHosted Service"
				ocelot = component "Ocelot" "Open source dotNet API Gateway project imported as a nuget package with customised modules" "Ocelot"
			}
			redis = container "Response Cache" "Redis database runs in Docker container locally for dev. Runs in Elasticache in AWS" "Redis" "Database"

			ocelot -> redis "Caches data in" "Redis Protocol"
			ocelotRoutesConfig -> ocelot "Reads route data from"
			taskScheduler -> ocelot "Refreshes specific cached content" "HTTP"
			ocelot -> niceLogging "Sinks error logs to" "RabbitMQ"
			guidanceWeb -> ocelot "Requests content from" "HTTP"
			nextWeb -> ocelot "Requests content from" "HTTP"
			ocelot ->  niceorg "Requests content from" "HTTP"
		}
    }

    views {
		container ocelotAPI "Containers" {
			include *
		}
		component nextWebApi "Component" {
			include *
		}
		styles {
            element "Database" {
                shape Cylinder
            }
			element "Json file" {
                shape Folder
            }
			element "Disabled" {
                background #C0C0C0
            }
		}
		theme default
    }
}
