---
layout: post
title: "linux işletim sisteminde checkpoint ssl/vpn bağlantısı"
categories: Linux
---
1. Adım aşağıdaki paketlerin kurulumu ve ek olarak güncel oracle JRE kurulumu sağlanmalıdır [(Kaynak)](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk65210)

2. Adım checkpoint web panelinden paylaşılan SNX dosyasını indirim kurulumunu sağlayalım

Linux Supported Platforms
<tbody>
<tr><td>Latest<br>Linux<br>Distribution</td><td>32-bit Prerequisites</td><td>64-bit Prerequisites</td><td>Installation command</td></tr>
<tr><td>Ubuntu<br>&nbsp;14.04<br>&nbsp;16.04<br>&nbsp;16.10<br>&nbsp;17.04</td><td>libpam0g:i386<br>libx11-6:i386<br>libstdc++6:i386<br>libstdc++5:i386</td><td>libpam0g:i386<br>libx11-6:i386<br>libstdc++6:i386<br>libstdc++5:i386<br>libnss3-tools (certutil)&nbsp;</td><td>Apt-get</td></tr>
<tr><td>openSUSE 11.4</td><td>libstdc++33</td><td><ol><li>pam-32bit</li><li>libstdc++33 32bit</li><li>Install all dependencies required by pam and libstdc++33 packages.</li></ol></td><td></td></tr>
<tr><td>openSuSE 12.2</td><td>compat-libstdc++</td><td><ol><li>pam-32bit</li><li>pam-modules-32bit</li><li>compat-libstdc++.i586</li></ol></td><td></td></tr>
<tr><td>Fedora 15</td><td><ol><li>xterm.i686</li><li>libXaw.so.7</li><li>libstdc++.so.5</li></ol></td><td><ol><li>Xterm.86_64 (with libXaw.86_64 dependency)</li><li>libX11.i686</li><li>pam-devel.i686 (which contains: libaudit.so.1, libcrack.so.2, lindb-4.8.so, libselinux.so.1, libpam.so.0)</li><li>libstdc++.so.5</li></ol></td><td></td></tr>
<tr><td>Fedora 16/18</span></td><td><ol><li>xterm.i686</li><li>libstdc++.so.5</li></ol></td><td><ol><li>xterm.x86_64 (with libXaw.86_64 dependency)</span></li><li>elf_utils-libelf.i686</span></li><li>libX11.i686</li><li>libaudit.so.1</li><li>libcrack.so.2</li><li>libdb-5.3.so</li><li>libselinux.so.1</li><li>libpam.so.0</li><li>libstdc++.so.5</li></ol>For Mobile Access Portal Agent: (also)<br><ol><li>10. libXext.i686</li><li>libXrender.i686</li><li>libXtst.i686</li><li>libXi.i686</li></ol></td><td>dnf install &lt;lib_name&gt;&nbsp;</td></tr>
<tr><td>RHEL 7.3 / 7.4</td><td>None</td><td>Same as Fedora 16 64-bit</td><td>yum-config-manager --enable rhel-7-server-optional-rpms<br>yum install</td></tr>
<tr><td>RHEL 6.1</td><td>Same as&nbsp;<br>Fedora&nbsp;<br>(16 32-bit)</td><td>Same as Fedora 16 64-bit</td><td></td></tr>
</tbody>

3. Adım aşağıdaki şekilde linux terminal üzerinden bağlantı sağlanabilir. [(Kaynak)](https://sc1.checkpoint.com/documents/R77/CP_R77_VPN_AdminGuide/html_frameset.htm?topic=documents/R77/CP_R77_VPN_AdminGuide/14702&anchor=o14729)

Not: Eğer kimlik doğrulama hatası alırsanız [burada](https://forum.porteus.org/viewtopic.php?t=6510) anlatıldığı üzere snx farklı sürümlerini deneyebilirsiniz
[(Kaynak 2)](https://www.fc.up.pt/ci/servicos/acesso/vpn/vpn-cp-linux.html?&item=495)

[CheckPointVPN_SNX_Linux_800007075.sh](https://drive.google.com/open?id=1CzfmNL7W_rsvf7KjxMsXS5DNyF7PJc0n)

SSL Network Extender Command Attributes
<tbody>
<tr><th>Attributes</th><th>Description</th></tr>
<tr><td>snx -f &lt;configuration file&gt;</td><td>Run SSL Network Extender using parameters defined in a configuration file other than the default name or location.</td></tr>
<tr><td>snx -d</td><td>Disconnect from Mobile Access</td></tr>
<tr><td>snx -s &lt;server&gt;</td><td>Specify server IP or hostname</td></tr>
<tr><td>snx -u &lt;username&gt;</td><td>Specify a valid user</td></tr>
<tr><td>snx -c &lt;certificate file&gt;</td><td>Specify which certificate is used to authenticate.</td></tr>
<tr><td>snx -l &lt;CA directory&gt;</td><td>Define the directory where CA's certificates are stored.</td></tr>
<tr><td>snx -p &lt;port&gt;</td><td>Change the HTTPS port. (default port is TCP 443).</td></tr>
<tr><td>snx -g</td><td>Enable debugging. snx.elg log file is created.</td></tr>
<tr><td>snx -e &lt;cipher&gt;</td><tdForce a specific encryption algorithm. Valid values - RC4 and 3DES.</td></tr>
</tbody>
