table2CSV
=========

This is a duplicate of another fork:
https://github.com/ZachWick/TableCSVExport 
that already implemented some more new features (emptyValue, showHiddenRows, rowFilter)

so just for completion, here the original manual:

A small JQuery utility which allows you to export any HTML table as CSV file

It's very handy tool to use specially during development of reporting projects. 
It is also useful when you have some 3rd party JQuery table search plugin attached to your table.

thanks to http://www.kunalbabre.com/projects/table2CSV.php


Option 1
=========
    $('#example1').table2CSV();

Option 2
=========
This can be used when you need custom header


    $('#example1').table2CSV({
      header:['prefix','Employee Name','Contact']
    });

Option 3
=========
This can be used when you need to get output as string

    alert(
      $('#example1').table2CSV({
      delivery:'value',
      header:['prefix','Employee Name','Contact']
    }));



Option 3.1 - Generate CSV File
=========
This can be done by posting the csv value obtained above to PHP or any similar server side script.


Step 1: Html File
-------
    <form action="getCSV.php" method ="post" > 
    <input type="hidden" name="csv_text" id="csv_text">
    <input type="submit" value="Get CSV File" 
       onclick="getCSVData()"
    </form>
    <script>
    function getCSVData(){
      var csv_value=$('#example1').table2CSV({delivery:'value'});
      $("#csv_text").val(csv_value);  
    }
    </script>


Step 2: PHP File ( getCSV.php )
--------
    <?php
    header("Content-type: application/octet-stream");
    header("Content-Disposition: attachment; filename=\"my-data.csv\"");
    $data=stripcslashes($_REQUEST['csv_text']);
    echo $data; 
    ?>

Option 4
=========
This can be used when you need different separator


    alert(
    $('#example1').table2CSV({
      separator : ';',
      delivery:'value',
      header:['prefix','Employee Name','Contact']
    }));



