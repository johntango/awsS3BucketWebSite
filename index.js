#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const static_site_1 = require("./static-site");
/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk synth -c domain=mystaticsite.com -c subdomain=www'
 * Or add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mystaticsite.com",
 *     "subdomain": "www"
 *   }
 * }
**/
class MyStaticSiteStack extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        new static_site_1.StaticSite(this, 'StaticSite', {
            domainName: this.node.tryGetContext('domain'),
            siteSubDomain: this.node.tryGetContext('subdomain'),
        });
    }
}
const app = new cdk.App();
new MyStaticSiteStack(app, 'MyStaticSite', { env: { region: 'us-east-1' } });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBc0M7QUFDdEMsK0NBQTJDO0FBRTNDOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksTUFBZSxFQUFFLElBQVksRUFBRSxLQUFxQjtRQUM1RCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQixJQUFJLHdCQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMvQixVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBQzdDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7U0FDdEQsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztDQUNIO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUU3RSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXHJcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XHJcbmltcG9ydCB7IFN0YXRpY1NpdGUgfSBmcm9tICcuL3N0YXRpYy1zaXRlJztcclxuXHJcbi8qKlxyXG4gKiBUaGlzIHN0YWNrIHJlbGllcyBvbiBnZXR0aW5nIHRoZSBkb21haW4gbmFtZSBmcm9tIENESyBjb250ZXh0LlxyXG4gKiBVc2UgJ2NkayBzeW50aCAtYyBkb21haW49bXlzdGF0aWNzaXRlLmNvbSAtYyBzdWJkb21haW49d3d3J1xyXG4gKiBPciBhZGQgdGhlIGZvbGxvd2luZyB0byBjZGsuanNvbjpcclxuICoge1xyXG4gKiAgIFwiY29udGV4dFwiOiB7XHJcbiAqICAgICBcImRvbWFpblwiOiBcIm15c3RhdGljc2l0ZS5jb21cIixcclxuICogICAgIFwic3ViZG9tYWluXCI6IFwid3d3XCJcclxuICogICB9XHJcbiAqIH1cclxuKiovXHJcbmNsYXNzIE15U3RhdGljU2l0ZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgbmFtZTogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIG5hbWUsIHByb3BzKTtcclxuXHJcbiAgICAgICAgbmV3IFN0YXRpY1NpdGUodGhpcywgJ1N0YXRpY1NpdGUnLCB7XHJcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdkb21haW4nKSxcclxuICAgICAgICAgICAgc2l0ZVN1YkRvbWFpbjogdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ3N1YmRvbWFpbicpLFxyXG4gICAgICAgIH0pO1xyXG4gICB9XHJcbn1cclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XHJcblxyXG5uZXcgTXlTdGF0aWNTaXRlU3RhY2soYXBwLCAnTXlTdGF0aWNTaXRlJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xyXG5cclxuYXBwLnN5bnRoKCk7Il19