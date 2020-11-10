---
layout: post
title: "javascript aç/kapa buton yapımı"
categories:javascript
---
web uygulamalarınızda aç/kapa buttonlara veya checkbox lara ihtiyaç duyabilirsiniz bu gibi durumlar için kullanabileceğiniz bir script

HTML

```xhtml

<table recordID="1" cellpadding="0" cellspacing="0" class="checkBox">
    <tr>
        <td selected>0</td>
        <td>1</td>
    </tr>
</table>
Script

jQuery(".checkBox").click(function() {
    jQuery(this).removeClass("errCheckBox");
    jQuery(this).find("td").each(function(id) {
        if (jQuery(this).attr("selected")) {
            jQuery(this).removeAttr("selected")
        } else {
            jQuery(this).attr("selected", "true");

        }
    });
    var val=(jQuery(this).find("td[selected]").text() == 0) ? false : true;
    //bu bölümde ajax ile sunucuya istek yapabilirsiniz
});
```
Style
```css

.checkBox
{
    width: 40px;
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    cursor: pointer;
    background-color: white;
    font-family: verdana;
    font-size: 11px;
    margin: 0px 5px;
    height: 18px;
}
.checkBox tr
{
    background-color: White;
}
.checkBox tr td:contains("0")
{
    box-shadow:1px 0px 3px 0px #646464;
}
.checkBox tr td:contains("1")
{
    box-shadow:1px 0px 3px 0px #646464;
}
.checkBox tr td[selected]
{
    background-color:#10C242;
    color:White;
}
.checkBox tr td[selected]:contains("0")
{
    background-color:#dd2206;
    color:White;
}
.checkBox tr td
{
    color: #C8C8C8;
    border-radius:5px;
}
```