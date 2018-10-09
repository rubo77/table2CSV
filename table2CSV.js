jQuery.fn.table2CSV = function (options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        headerSelector: 'th',
        columnSelector: 'td',
        delivery: 'popup', // popup, value, download
        // filename: 'powered_by_sinri.csv', // filename to download
        transform_gt_lt: true, // make &gt; and &lt; to > and <
        replace: [], // [Regexp a,q]
        skipLine: [], //Array Skip Line 
    },
            options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var tmpRow = []; // construct header avalible array

    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        $(el).filter(':visible').find(options.headerSelector).each(function () {
            if ($(this).css('display') != 'none')
                tmpRow[tmpRow.length] = formatData($(this).html());
        });
    }

    row2CSV(tmpRow);

    // actual data
    $(el).find('tr').each(function () {
        var tmpRow = [];
        $(this).filter(':visible').find(options.columnSelector).each(function () {
            if ($(this).css('display') != 'none')
                tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2CSV(tmpRow);
    });
    if (options.delivery == 'popup') {
        var mydata = csvData.join('\n');
        if (options.transform_gt_lt) {
            mydata = sinri_recover_gt_and_lt(mydata);
        }
        return popup(mydata);
    } else if (options.delivery == 'download') {
        var mydata = csvData.join('\n');
        if (options.transform_gt_lt) {
            mydata = sinri_recover_gt_and_lt(mydata);
        }
        //var url = 'data:text/csv;charset=utf8,' + encodeURIComponent(mydata);
        openSaveFileDialog(mydata, options.filename, 'text/csv');
        //window.open(url);
        return true;
    } else {
        var mydata = csvData.join('\n');
        if (options.transform_gt_lt) {
            mydata = sinri_recover_gt_and_lt(mydata);
        }
        return mydata;
    }

    function sinri_recover_gt_and_lt(input) {
        var regexp = new RegExp(/&gt;/g);
        var input = input.replace(regexp, '>');
        var regexp = new RegExp(/&lt;/g);
        var input = input.replace(regexp, '<');
        return input;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            if (jQuery.inArray(csvData.length, options.skipLine) !== -1) {
                options.skipLine.splice(jQuery.inArray(csvData.length, options.skipLine), 1);
            } else {
                csvData[csvData.length] = mystr;
            }
        }
    }
    function formatData(input) {
        // replace " with “
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "“");
        //if isset replace
        if (options.replace.length == 2) {
            var regexp = new RegExp(options.replace[0]);
            var output = input.replace(regexp, options.replace[1]);
        }
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        output = output.replace(/&nbsp;/gi, ' '); //replace &nbsp;
        if (output == "")
            return '';
        return '"' + output.trim() + '"';
    }
    function popup(data) {
        var generator = window.open('', 'csv', 'height=400,width=600');
        generator.document.write('<html><head><title>CSV</title>');
        generator.document.write('</head><body >');
        generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
        generator.document.write(data);
        generator.document.write('</textArea>');
        generator.document.write('</body></html>');
        generator.document.close();
        return true;
    }
    function openSaveFileDialog(data, filename, mimetype) {

        if (!data)
            return;

        var blob = data.constructor !== Blob
                ? new Blob([data], {type: mimetype || 'application/octet-stream'})
                : data;

        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
            return;
        }

        var lnk = document.createElement('a'),
                url = window.URL,
                objectURL;

        if (mimetype) {
            lnk.type = mimetype;
        }

        lnk.download = filename || 'untitled';
        lnk.href = objectURL = url.createObjectURL(blob);
        lnk.dispatchEvent(new MouseEvent('click'));
        setTimeout(url.revokeObjectURL.bind(url, objectURL));

    }
};
