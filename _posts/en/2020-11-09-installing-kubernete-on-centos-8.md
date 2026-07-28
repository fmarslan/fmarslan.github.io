---
layout: post
title: "Installing Kubernete on Centos 8"
date: 2020-11-09
description: "A brief technical note outlining the basic approach and applicable steps for Installing Kubernete on Centos 8."
categories: linux
lang: en-US
translation_key: "centos-8-uzerine-kubernete-kurulumu-a07b21cb"
permalink: /en/2020/11/09/installing-kubernete-on-centos-8.html
---

### Recommendations
First of all, I recommend that you separate the OS and Data disk partition as a partition, if not as a disk, if possible. Then, if you have to move to another server, you can only move it with the image or mount process.
If you can keep the data partition in small partitions, it will make things easier when moving to a new environment.

[Centos 8 Parition Management](/linux/2020/11/09/centos-8-partition-olusturma-silme.html)


Those who want to install kubernete will encounter 2 different kubernete versions: minikube and kubernete installation. mini kube will create a virtual machine on your computer and provide you with a ready-made environment. If you are going to deal with simple tests, etc. and run it in your local area, I recommend this installation, but here I will write the steps of the 1 node kubernete installation.


If you have tried etc., the first step will be to uninstall the existing Docker versions.

```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

Required utility installation for yum

```bash
sudo yum install -y yum-utils

```

Let's increase the amount of virtual memory. Don't forget to add this command to ``` /etc/sysctl.conf ``` so that it will be applied again when you reboot the server.

```sh
sysctl -w vm.max_map_count=262144
```

Let's add the repo
```bash
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

let's install docker
```bash
sudo yum-config-manager --disable docker-ce-stable
```

If we are going to use our disk as LVM, you should make the settings here. We need to save it as /etc/docker/daemon.json.
We are starting Docker
```bash
sudo systemctl start docker
```
We test Docker installation
```bash
sudo docker run hello-world
```

We activate the service so that it starts automatically.
```bash
sudo  systemctl enable docker
```

 We install the kubeadm, kubelet, kubectl commands.
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# Set SELinux in permissive mode (effectively disabling it)
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet
```

Now we can start the kubernete installation😊 yes, we are starting now, we run the following command and then it gives us the output. 
kubeadm init

The commands received from the result will be similar to this. These commands create the kubeconfig files we need to manage kubernetes. If we are going to set up more than one node, it shares the join information, we do not look at them since we will set up a single node.
```bash
mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

We are installing a Kubernete network plugin, here we installed Weawe. 
```bash
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

We are removing master fixation.
```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

We are testing the kubernete installation. When we run the command below, we should see it ready against the node, but in order to see it as ready in Centos 8, we continue with the step below.
```bash
kubectl get nodes 
```

In Centos 8, iptables was removed and nftables was used instead. Kubernete does not work with nftables, so we must turn off nftables and activate iptables instead. For this part, the following commands normally work, but sometimes different interventions may be required depending on the situation, first we turn off the firewall.
```bash
systemctl disable --now firewalld
systemctl mask firewalld
```

Then we reboot and install iptables. We also did this extra, but since it is a hacking process, it will change with updates, so it would be best to understand the logic and determine the method according to the current version.
```bash
sudo yum install iptables-services
systemctl start iptables
systemctl enable iptables
```


After these operations, when we see node read, our kubernete installation is completed. You can perform your storage deployment operations.

I would like to thank [Kazım Sarıkaya](https://srkykzm.com/) for his contributions.
