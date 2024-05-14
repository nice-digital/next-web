# AWS Performance Testing

 > These scripts allow you easily create, and update AWS ECS infrastructure to run 'containerised' NextWeb - NextJS based app using Terraform.

## What is it?

This project consists of a the terraform templates to create infrastructure in AWS. It creates Docker containers in ECS Fargate. It also creates/updates some of the the relevant security groups/rules. These are then used by Teamcity and Octopus Deploy.

## How to use?
### Install and dev locally


 - Install instructions for AWS CLI can be found here - [Installing or updating the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
 - Install instructions for Terraform can be found here - [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
 - Terraform works best on linux - so its easier to use Ubuntu on WSL2 - make sure this is installed and working correctly before continuing.

### Configure
All configuration is in code, Teamcity and Octopus deploy.
### Usage locally
You can run terraform locally and use it to create/configure/update AWS. Terraform and AWS CLI does seem to run better in Linux - so WSL is your best bet.

To create, start an Docker container running in AWS run the following commands...
1. Make sure you have run and configured an AWS account that has permissions to create resources in AWS. [More info is here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) You need to run 
``` bash 
aws configure
```
1. Iniitlaise the Terraform by changing to the directory with main.tf in. This will check your AWS permissions and also initilase the local state storeage.
    ```bash
    terraform init
    ```
1. Apply the terraform config but running command below and typing "yes" when prompted if you are happy with the config changes
    ```bash
    terraform apply
    ```
1. This will apply the terraform config and then will create the machine and all the security groups etc.... 

### Destroying the instances once finished
1. To shutdown and remove all the created infrastructure that was created earlier simply run....
    ```bash
    terraform destroy
    ```
Make sure you say "yes" to confirm the changes.

## Troubleshooting

## Gotchas

### Update of NextWeb config variables in Octopus Deploy don't result in a task/variable update in ECS
Problem:- Terraform only detects and applies differences found in TF files. If you update variables in Octopus which are stored in the NextWeb config directly and no other changes are present then the deployment wont actually deploy anything to ECS. 

Solution:- 
If you only make a change to NextWeb config (such as an api key) and you need it to deploy - you need to create a new release. This is best achieved by triggering a Teamcity build as the last four digits of the build number need to be different.


### Random Commands

