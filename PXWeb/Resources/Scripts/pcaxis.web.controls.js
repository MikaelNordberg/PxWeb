﻿/// <reference path="jquery.js" />

jQuery.noConflict();

///CommandBar

function PivotManual_Switch(fromId, toId) {
    jQuery("#" + fromId + " option:selected").appendTo("#" + toId);
    //Begin Hack for IE (Does not reposition listboxes automatically)
    jQuery(".commandbar_container").hide(0.0000001);
    jQuery(".commandbar_container").show(0.0000001);
    //End Hack

    PivotManual_Deselect(fromId, toId);

    return false;
}

function PivotManual_Deselect(fromId, toId) {
    jQuery("#" + fromId + " option:selected").attr("selected", false);
    jQuery("#" + toId + " option:selected").attr("selected", false);

    jQuery("#" + fromId).attr("selectedIndex", "-1");
    jQuery("#" + toId).attr("selectedIndex", "-1");
}

function PivotManual_Reorder(listId, direction) {
    if (direction == "top") {
        jQuery("#" + listId + " option:selected").remove().prependTo("#" + listId);
    }
    else {
        jQuery("#" + listId + " option:selected").remove().appendTo("#" + listId);
    }
    return false;
}

function PivotManual_Submit(headingId, stubId) {
    var headings = "";
    var stubs = "";

    jQuery("#" + headingId + " option").each(function() {
        headings += jQuery(this).text() + "@";
    });

    jQuery("#" + stubId + " option").each(function() {
        stubs += jQuery(this).text() + "@";
    });

    jQuery("#PivotManualStubList").val(stubs)
    jQuery("#PivotManualHeadingList").val(headings)

}


function UpdateNumberSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy) {
    var count = 0;
    var selectbox = document.getElementById(ListBoxID.replace(/\$/gi, "_"));
    for (var i = 0; i < selectbox.length; i++) {
        if (selectbox.options[i].selected)//attr('selected', '1'))
        {
            count++;
        }
    }
    var statsspan = document.getElementById(StatsSpanID.replace(/\$/gi, "_"));

    if (statsspan != null) {
        statsspan.value = count;
    }

    if (window.SelectedValueChanged) {
        SelectedValueChanged(ListBoxID.replace(/\$/gi, "_"), variablePlacement, count, limitSelectionBy);
    }
}

function SelectOperands(selectedValue, textBoxIDValue1, textBoxIDValue2) {
    var count = 0;
    var textbox1 = document.getElementById(textBoxIDValue1);
    var textbox2 = document.getElementById(textBoxIDValue2);
    if (textbox1.value.length < 1) {
        textbox1.value = selectedValue;
    }
    else {
        if (textbox1.value != selectedValue) {
            textbox2.value = selectedValue;
        }
    }
}

function SetUniqueRadioButton(nameregex, current) {
    re = new RegExp(nameregex);
    for (i = 0; i < current.form.elements.length; i++) {
        elm = current.form.elements[i]
        if (elm.type == 'radio') {
            if (re.test(elm.name)) {
                elm.checked = false;
            }
        }
    }
    current.checked = true;
}


// Variable selector


// Select all elements in a listbox and updates the number selected
function VariableSelector_SelectAllAndUpdateNrSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy) {
    VariableSelector_SelectAll(ListBoxID)
    UpdateNumberSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy);
    return false;
}


// Select all elements in a listbox
function VariableSelector_SelectAll(ListBoxID) {
    var selectbox = document.getElementById(ListBoxID.replace(/\$/gi, "_"));
    for (var i = 0; i < selectbox.length; i++) {
        selectbox.options[i].selected = true;
    }
    return false;
}

// Deselect all elements in a listbox and updates the number selected
function VariableSelector_DeselectAllAndUpdateNrSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy) {
    VariableSelector_DeselectAll(ListBoxID)
    UpdateNumberSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy);
    return false;
}

// Deselect all elements in a listbox
function VariableSelector_DeselectAll(ListBoxID) {
    var selectbox = document.getElementById(ListBoxID.replace(/\$/gi, "_"));
    for (var i = 0; i < selectbox.length; i++) {
        selectbox.options[i].selected = false;
    }
    return false;
}

// Sort all elements in a listbox in descending order and updates number selected
function VariableSelector_SortDescendingAndUpdateNrSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy) {
    VariableSelector_SortDescending(ListBoxID)
    UpdateNumberSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy);
    return false;
}

// Sort all elements in a listbox in descending order
function VariableSelector_SortDescending(ListBoxID) {
    var selectbox = document.getElementById(ListBoxID.replace(/\$/gi, "_"));
    sortOptions(selectbox, false);
    return false;
}

// Sort all elements in a listbox in ascending order and updates number selected
function VariableSelector_SortAscendingAndUpdateNrSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy) {
    VariableSelector_SortAscending(ListBoxID)
    UpdateNumberSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy);
    return false;
}

// Sort all elements in a listbox in ascending order
function VariableSelector_SortAscending(ListBoxID) {
    var selectbox = document.getElementById(ListBoxID.replace(/\$/gi, "_"));
    sortOptions(selectbox, true);
    return false;
}

//Search values in listbox with the given text
function VariableSelector_SearchValues(ListBoxID, TextBoxID, CheckBoxID, StatsSpanID, variablePlacement, limitSelectionBy) {
    var sc;
    var r, re;
    var lst;
    var contains;

    //Get text
    sc = jQuery("#" + TextBoxID).prop("value");

    //Search from beginning or not?
    contains = !jQuery("#" + CheckBoxID).prop("checked");

    //Get listbox
    lst = document.getElementById(ListBoxID.replace(/\$/gi, "_"));

    //Remove illegal characters
    re = /\(/i;
    r = sc.replace(re, "\\(");
    sc = r;
    re = /\)/i;
    r = sc.replace(re, "\\)");
    sc = r;
    re = /\./i;
    r = sc.replace(re, "\\.");
    sc = r;
    re = /\+/i;
    r = sc.replace(re, "\\+");
    sc = r;
    re = /\?/i;
    r = sc.replace(re, "\\?");
    sc = r;

    var cmplength = sc.length;

    // Old browsers might not support startsWith
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            return this.substr(position || 0, searchString.length) === searchString;
        };
    }

    var searchStr = sc.toLowerCase();

    for (i = lst.options.length - 1; i > -1; i--) {
        var currentOption = lst.options[i];

        if (contains) {
            if (currentOption.text.toLowerCase().indexOf(searchStr) !== -1) {
                currentOption.selected = true;
            }
        } else {
            var optionText = currentOption.text.toLowerCase();

            if (optionText.startsWith(searchStr) || optionText.indexOf(' ' + searchStr) !== -1) {
                currentOption.selected = true;
            }
        }
    }

    UpdateNumberSelected(ListBoxID, StatsSpanID, variablePlacement, limitSelectionBy);

    return false;
}

// Compare helper used to sort text in ascending order
function compareOptionTextAscending(a, b) {
    return a.text.localeCompare(b.text);
    // textual comparison
    //return a.text != b.text ? a.text < b.text ? -1 : 1 : 0;
    // numerical comparison
    //  return a.text - b.text;
}

// Compare helper used to sort text in descending order
function compareOptionTextDescending(a, b) {
    return -(a.text.localeCompare(b.text));
    //return a.text != b.text ? a.text < b.text ? 1 : -1 : 0;
}



// Sorts a lisbox.
// If isAscending == true   => ascending order
// If isAscending == false  => descending order
function sortOptions(list, isAscending) {
    var items = list.options.length;
    // create array and make copies of options in list
    var tmpArray = new Array(items);
    for (i = 0; i < items; i++)
        tmpArray[i] = new 
    Option(list.options[i].text, list.options[i].value);
    // sort options using given function
    if (isAscending)
        tmpArray.sort(compareOptionTextAscending);
    else
        tmpArray.sort(compareOptionTextDescending);
    // make copies of sorted options back to list
    for (i = 0; i < items; i++)
        list.options[i] = new Option(tmpArray[i].text, tmpArray[i].value);
}

//Automatical download of file from Commandbar (don´t have to click the download-link...)
function automaticFileDownload(id) {
    //Open file in a new window
    window.open(jQuery("#" + id).attr("href"));
    //Hide the download link
    jQuery("#" + id).hide();
}

// Downloads the file selected in a combobox by open a new window with the download url.
function downloadSelectedFile(combobox) {
    if (combobox.selectedIndex > 0) {
        //window.open(combobox.options[combobox.selectedIndex].value);
        //window.location = combobox.options[combobox.selectedIndex].value;
        commandbarDownloadFile(combobox.options[combobox.selectedIndex].value);
    }
    combobox.selectedIndex = 0;
}

// Download file. The parameter url must have the following format: webpage?parameters...&downloadfile=filetype
function commandbarDownloadFile(url) {
    var closeScript = "jQuery('[id$=commandbarDownloadFileDialog]').dialog('destroy');"
    jQuery("[id$=commandbarDownloadFileLink]").attr("href", url);
    jQuery("[id$=commandbarDownloadFileLink]").attr("onclick", closeScript);
    //jQuery("[id$=commandbarDownloadFileDialog]").dialog({ modal: true, hide: "fade", resizable: false, close: function(ev, ui) { jQuery(this).dialog('destroy'); } });
    jQuery("[id$=commandbarDownloadFileDialog]").dialogFunction();
}

//Open up the given div as a modal popup dialog
jQuery.fn.dialogFunction = function(options) {
    var divId = jQuery(this)[0].id;  
    //Check if dialog already exists, and if so just open it  
    //This solves the can't open same dialog twice issue.
    if (jQuery("#" + divId).is(':data(dialog)')) {
        jQuery("#" + divId).dialog("open");  
    }  
    else{
        jQuery("#" + divId).dialog({
                                width: jQuery("#" + divId).css("width"),
                                modal: true,
                                hide: "fade",
                                resizable: false, 
                                close: function(ev, ui) { jQuery(this).dialog('destroy'); } });
            jQuery("#" + divId).dialog("open").find(":input").eq(0).focus();  
     }  
}; 

//Replaces an element with .id-property in an array if it exists, else adds element to array
//arr: array to remove item from
//ele: element to be changed or added to the array
//Return: array
function AddVariableListBox(arr, ele) {
    var foundAt = -1;
    jQuery.each(arr, function(index, obj) {
        if (obj.id == ele.id) {
            arr[index] = ele;
            foundAt = index;
            return false;
        }
    });
    if (foundAt < 0) {
        arr[arr.length] = ele;
    }
    return arr;
}

//Removes an element with .id-property from array
//arr: array to remove item from
//ele: element to be removed from the array
//Return: array
function RemoveVariableListBox(arr, ele) {
    var removeItem = ele.id;
    arr = jQuery.grep(arr, function(arrayElement) {
        return arrayElement.id != removeItem;
    });
    return arr;
}

//Sets text in textbox(es)
//text: text to textbox
//nameregex: part of textboxneme, all textboxes that matches gets the text
function SetTextBoxText(text, nameregex) {
    var re = new RegExp(nameregex);
    jQuery.each(jQuery("input:text"), function(index, obj) {
        if (re.test(obj.name)) {
            obj.value = text;
        }
    });
}


//Replaces or appends text in label(s)
//text: text to label
//idregex: part of labelid, all labels that matches gets the text
//append: if true text is appended, if false text is replaced
function SetLabelText(text, idregex, append) {
    var re = new RegExp(idregex);
    jQuery.each(jQuery("span"), function(index, obj) {
        if (re.test(obj.id)) {
            if (append) {
                obj.innerHTML += text;
            } else {
                obj.innerHTML = text;
            }
        }
    });
}

//Replaces or appends text in label(s)
//text: text to label
//idregex: part of labelid, all labels that matches gets the text
//cssclass: the labels css-class
//append: if true text is appended, if false text is replaced
function SetLabelText_IdAndCSS(text, idregex, cssclass, append) {
    var re = new RegExp(idregex);
    jQuery.each(jQuery("span"), function(index, obj) {
        if (re.test(obj.id)) {
            if (jQuery(this).hasClass(cssclass)) {
                if (append) {
                    obj.innerHTML += text;
                } else {
                obj.innerHTML = text;
                }
            }
        }
    });
}

//Return text from label
//idregex: part of labelid, first label that matches both in id part and css class is used.
//cssclass: the labels css-class
function GetLabelText(idregex,cssclass) {
    var re = new RegExp(idregex);
    var retval = "";
    jQuery.each(jQuery("span"), function(index, obj) {
        if (re.test(obj.id)) {
            if (jQuery(this).hasClass(cssclass)) {
                retval = (this).innerHTML;
                return false;
            }
        }
    });
    return retval;
}


//Hides an element depending on jQuery selector
///Parameter example: ".commandbar_action"
function PCAxis_HideElement(selector) {
    jQuery(selector).hide(0);
}

//Display information dialog about the clicked cell in the table
function displayCellInformation(id, closetext) {
    var url = location.href;
    var bookmarkIndex = url.indexOf("#");

    var paramChar;

    if (url.indexOf('?') !== -1) {
        paramChar = '&';
    }
    else {
        paramChar = '?';
    }

    //Handle bookmark in URL
    if (bookmarkIndex >= 0) {
        url = url.slice(0, bookmarkIndex) + paramChar + 'cellid=' + id + url.slice(bookmarkIndex);
    }
    else {
        url = url + paramChar + 'cellid=' + id;
    } 

    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem("rxid")) {
        // create rxid cookie before making Ajax request
        document.cookie = "rxid=" + sessionStorage.getItem("rxid") + "; path=/";
        jQuery("[id$=pxtableCellInformationDialog]").load(url, function () {
            document.cookie = "rxid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        });
    } else {
        jQuery("[id$=pxtableCellInformationDialog]").load(url);
    }

    jQuery("[id$=pxtableCellInformationDialog]").dialog({ width: 480, height: 400, modal: true, buttons: [{ text: closetext, click: function () { jQuery(this).dialog('close'); } }], hide: "fade", close: function (ev, ui) { jQuery(this).dialog('destroy'); } });
}

//Enable/disable elements of the given class
function disableFromClass(className, disable) {
    jQuery("." + className).prop('disabled', disable);
}

/*------------------------------------------*/
/* Functions for setting panels (accordions) */
/*------------------------------------------*/

// Collapse all settingpanels
function settingpanelCollapseAll() {
    //Hide any currently displayed setting panel
    jQuery('.settingpanel').hide(0);

    //Change expand image on all links
    var col = jQuery('.px-settings-collapseimage');
    col.removeClass('px-settings-collapseimage');
    col.addClass('px-settings-expandimage');
}

// Check if the given setting panel is expanded or not
function settingpanelIsExpanded(obj) {
    return jQuery(obj).hasClass('settingpanelexpanded');
}

// Collapse the specified setting panel
function settingpanelCollapse(obj) {
    jQuery(obj).removeClass('settingpanelexpanded');
}

// Expand the setting panel with the given panel class
function settingpanelExpand(panelclass) {
    //Find link for specified panel
    var lnk = jQuery('.' + panelclass + '.panelshowlink');
    //Remove expanded class from all panellinks
    jQuery('.panelshowlink').removeClass('settingpanelexpanded');
    //Add expanded class to this panellink
    jQuery(lnk).addClass('settingpanelexpanded');
    //Show my setting panel
    jQuery('.' + panelclass + '.settingpanel').show(0);
    //Change expand-image
    var img = jQuery(lnk).find('.px-settings-expandimage');
    img.removeClass('px-settings-expandimage');
    img.addClass('px-settings-collapseimage');

}
