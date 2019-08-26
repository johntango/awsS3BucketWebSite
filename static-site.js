#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudfront = require("@aws-cdk/aws-cloudfront");
const route53 = require("@aws-cdk/aws-route53");
const s3 = require("@aws-cdk/aws-s3");
const acm = require("@aws-cdk/aws-certificatemanager");
const cdk = require("@aws-cdk/core");
const targets = require("@aws-cdk/aws-route53-targets/lib");
const core_1 = require("@aws-cdk/core");
/**
 * Static site infrastructure, which uses an S3 bucket for the content.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 *
 * The ACM certificate is expected to be created and validated outside of the CDK,
 * with the certificate ARN stored in an SSM Parameter.
 */
class StaticSite extends core_1.Construct {
    constructor(parent, name, props) {
        super(parent, name);
        const siteDomain = props.siteSubDomain + '.' + props.domainName;
        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            publicReadAccess: true
        });
        new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });
        // Pre-existing ACM certificate, with the ARN stored in an SSM Parameter
        const certificateArn = new acm.Certificate(this, 'ArnParameter', {
            domainName: props.domainName
        }).certificateArn;
        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [siteDomain],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                }
            ]
        });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
        /**
         * NOTE: the code below is not transpiling properly to JavaScript
         * Pending review by AWS team
         */
        // Route53 alias record for the CloudFront distribution
        const zone = new route53.HostedZone(this, 'MyHostedZone', {
            zoneName: props.domainName
        });
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: route53.AddressRecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzREFBdUQ7QUFDdkQsZ0RBQWlEO0FBQ2pELHNDQUF1QztBQUN2Qyx1REFBd0Q7QUFDeEQscUNBQXNDO0FBQ3RDLDREQUE2RDtBQUM3RCx3Q0FBMEM7QUFPMUM7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLFVBQVcsU0FBUSxnQkFBUztJQUNyQyxZQUFZLE1BQWlCLEVBQUUsSUFBWSxFQUFFLEtBQXNCO1FBQy9ELEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVoRSxpQkFBaUI7UUFDakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsVUFBVSxFQUFFLFVBQVU7WUFDdEIsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFcEUsd0VBQXdFO1FBQ3hFLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtTQUMvQixDQUFDLENBQUMsY0FBYyxDQUFDO1FBRWxCLDhDQUE4QztRQUM5QyxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDcEYsa0JBQWtCLEVBQUU7Z0JBQ2hCLFVBQVUsRUFBRSxjQUFjO2dCQUMxQixLQUFLLEVBQUUsQ0FBRSxVQUFVLENBQUU7Z0JBQ3JCLFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUc7Z0JBQ25DLGNBQWMsRUFBRSxVQUFVLENBQUMsc0JBQXNCLENBQUMsYUFBYTthQUNsRTtZQUNELGFBQWEsRUFBRTtnQkFDWDtvQkFDSSxjQUFjLEVBQUU7d0JBQ1osY0FBYyxFQUFFLFVBQVU7cUJBQzdCO29CQUNELFNBQVMsRUFBRyxDQUFFLEVBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFDLENBQUM7aUJBQzNDO2FBQ0o7U0FDSixDQUFDLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBRWxGOzs7V0FHRztRQUVILHVEQUF1RDtRQUN2RCxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0RCxRQUFRLEVBQUUsS0FBSyxDQUFDLFVBQVU7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6QyxVQUFVLEVBQUUsVUFBVTtZQUN0QixNQUFNLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RixJQUFJO1NBQ1AsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBdERELGdDQXNEQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0IGNsb3VkZnJvbnQgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtY2xvdWRmcm9udCcpO1xyXG5pbXBvcnQgcm91dGU1MyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJyk7XHRcclxuaW1wb3J0IHMzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXMzJyk7XHJcbmltcG9ydCBhY20gPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJyk7XHJcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XHJcbmltcG9ydCB0YXJnZXRzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXJvdXRlNTMtdGFyZ2V0cy9saWInKTtcdFxyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGljU2l0ZVByb3BzIHtcclxuICAgIGRvbWFpbk5hbWU6IHN0cmluZztcclxuICAgIHNpdGVTdWJEb21haW46IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFN0YXRpYyBzaXRlIGluZnJhc3RydWN0dXJlLCB3aGljaCB1c2VzIGFuIFMzIGJ1Y2tldCBmb3IgdGhlIGNvbnRlbnQuXHJcbiAqXHJcbiAqIFRoZSBzaXRlIHJlZGlyZWN0cyBmcm9tIEhUVFAgdG8gSFRUUFMsIHVzaW5nIGEgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24sXHJcbiAqIFJvdXRlNTMgYWxpYXMgcmVjb3JkLCBhbmQgQUNNIGNlcnRpZmljYXRlLlxyXG4gKlxyXG4gKiBUaGUgQUNNIGNlcnRpZmljYXRlIGlzIGV4cGVjdGVkIHRvIGJlIGNyZWF0ZWQgYW5kIHZhbGlkYXRlZCBvdXRzaWRlIG9mIHRoZSBDREssXHJcbiAqIHdpdGggdGhlIGNlcnRpZmljYXRlIEFSTiBzdG9yZWQgaW4gYW4gU1NNIFBhcmFtZXRlci5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTdGF0aWNTaXRlIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogQ29uc3RydWN0LCBuYW1lOiBzdHJpbmcsIHByb3BzOiBTdGF0aWNTaXRlUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIG5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCBzaXRlRG9tYWluID0gcHJvcHMuc2l0ZVN1YkRvbWFpbiArICcuJyArIHByb3BzLmRvbWFpbk5hbWU7XHJcblxyXG4gICAgICAgIC8vIENvbnRlbnQgYnVja2V0XHJcbiAgICAgICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NpdGVCdWNrZXQnLCB7XHJcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IHNpdGVEb21haW4sXHJcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnZXJyb3IuaHRtbCcsXHJcbiAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVja2V0JywgeyB2YWx1ZTogc2l0ZUJ1Y2tldC5idWNrZXROYW1lIH0pO1xyXG5cclxuICAgICAgICAvLyBQcmUtZXhpc3RpbmcgQUNNIGNlcnRpZmljYXRlLCB3aXRoIHRoZSBBUk4gc3RvcmVkIGluIGFuIFNTTSBQYXJhbWV0ZXJcclxuICAgICAgICBjb25zdCBjZXJ0aWZpY2F0ZUFybiA9IG5ldyBhY20uQ2VydGlmaWNhdGUodGhpcywgJ0FyblBhcmFtZXRlcicsIHtcclxuICAgICAgICAgICAgZG9tYWluTmFtZTogcHJvcHMuZG9tYWluTmFtZVxyXG4gICAgICAgIH0pLmNlcnRpZmljYXRlQXJuO1xyXG5cclxuICAgICAgICAvLyBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbiB0aGF0IHByb3ZpZGVzIEhUVFBTXHJcbiAgICAgICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnU2l0ZURpc3RyaWJ1dGlvbicsIHtcclxuICAgICAgICAgICAgYWxpYXNDb25maWd1cmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBhY21DZXJ0UmVmOiBjZXJ0aWZpY2F0ZUFybixcclxuICAgICAgICAgICAgICAgIG5hbWVzOiBbIHNpdGVEb21haW4gXSxcclxuICAgICAgICAgICAgICAgIHNzbE1ldGhvZDogY2xvdWRmcm9udC5TU0xNZXRob2QuU05JLFxyXG4gICAgICAgICAgICAgICAgc2VjdXJpdHlQb2xpY3k6IGNsb3VkZnJvbnQuU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMV8yMDE2LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvcmlnaW5Db25maWdzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNpdGVCdWNrZXRcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9ycyA6IFsge2lzRGVmYXVsdEJlaGF2aW9yOiB0cnVlfV0sXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnRGlzdHJpYnV0aW9uSWQnLCB7IHZhbHVlOiBkaXN0cmlidXRpb24uZGlzdHJpYnV0aW9uSWQgfSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE5PVEU6IHRoZSBjb2RlIGJlbG93IGlzIG5vdCB0cmFuc3BpbGluZyBwcm9wZXJseSB0byBKYXZhU2NyaXB0XHJcbiAgICAgICAgICogUGVuZGluZyByZXZpZXcgYnkgQVdTIHRlYW1cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLy8gUm91dGU1MyBhbGlhcyByZWNvcmQgZm9yIHRoZSBDbG91ZEZyb250IGRpc3RyaWJ1dGlvblxyXG4gICAgICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHRoaXMsICdNeUhvc3RlZFpvbmUnLCB7XHJcbiAgICAgICAgICAgIHpvbmVOYW1lOiBwcm9wcy5kb21haW5OYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmV3IHJvdXRlNTMuQVJlY29yZCh0aGlzLCAnU2l0ZUFsaWFzUmVjb3JkJywge1xyXG4gICAgICAgICAgICByZWNvcmROYW1lOiBzaXRlRG9tYWluLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IHJvdXRlNTMuQWRkcmVzc1JlY29yZFRhcmdldC5mcm9tQWxpYXMobmV3IHRhcmdldHMuQ2xvdWRGcm9udFRhcmdldChkaXN0cmlidXRpb24pKSxcclxuICAgICAgICAgICAgem9uZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il19