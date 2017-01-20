// Javascript from Moodle modules
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// NOTICE OF COPYRIGHT                                                     //
//                                                                         //
// Moodle - Filter for converting TeX notation to typeset mathematics      //
// using jsMath                                                            //
//                                                                         //
// Copyright (C) 2005-2008 by Davide P. Cervone                            //
// This program is free software; you can redistribute it and/or modify    //
// it under the terms of the GNU General Public License as published by    //
// the Free Software Foundation; either version 2 of the License, or       //
// (at your option) any later version.                                     //
//                                                                         //
// This program is distributed in the hope that it will be useful,         //
// but WITHOUT ANY WARRANTY; without even the implied warranty of          //
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           //
// GNU General Public License for more details:                            //
//                                                                         //
//          http://www.gnu.org/copyleft/gpl.html                           //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////

/****************************************************************/
/*
 *  Configure the jsMath filter here.  See also the filter.php file.
 */

jsMath = {
  Moodle: {
    version: 1.9,               // version of this file
    processSlashParens: 1,      // process \(...\) in text?
    processSlashBrackets: 1,    // process \[...\] in text?
    processDoubleDollars: 1,    // process $$...$$ in text?
    processSingleDollars: 0,    // process $...$ in text?
    fixEscapedDollars: 0,       // convert \$ to $ outside of math mode?
    mimetexCompatible: 0,       // make jsMath handle mimetex better?
    doubleDollarsAreInLine: 1,  // make $$...$$ be in-line math?
    allowDoubleClicks: 1,       // show TeX source for double-clicks?
    allowDisableTag: 1,         // allow ID="tex2math_off" to disable tex2math?
    showFontWarnings: 0,        // show jsMath font warning messages?
    processPopups: 1,           // process math in popup windows?
    loadFiles:  ['extensions/AMSmath.js', 'extensions/AMSsymbols.js'],            // a single file name or [file,file,...]
    loadFonts: null,            // a single font name or [font,font,...]
    scale: 120,                 // the default scaling factor for jsMath
    filter: 'filter/jsmath'     // where the filter is found
  }
};

//  If you want to use your own custom delimiters for math instead
//  of the usual ones, then uncomment the following four lines and
//  insert your own delimiters within the quotes.  You may want to
//  turn off processing of the dollars and other delimiters above
//  as well, though you can use them in combination with the
//  custom delimiters if you wish.

//     jsMath.Moodle.customDelimiters = [
//        '[math]','[/math]',        // to begin and end in-line math
//        '[display]','[/display]'   // to begin and end display math
//     ];

//  [Note that the code below doesn't do any special quoting of the
//  strings, so you should not use single quotes or backslashes as
//  part of your strings, unless you know what you are doing.  See
//  the jsMath author's documentation for the tex2math plugin for
//  more caveats about using custom delimiters.]

/****************************************************************/
/****************************************************************/
//
//            DO NOT MAKE CHANGES BELOW THIS
//
/****************************************************************/
/****************************************************************/

jsMath.Autoload = {
  findTeXstrings: 0,
  findLaTeXstrings: 0,
  findCustomStrings: jsMath.Moodle.customDelimiters,
  loadFiles: jsMath.Moodle.loadFiles,
  loadFonts: jsMath.Moodle.loadFonts
};

if (jsMath.Moodle.processSingleDollars ||
    jsMath.Moodle.processDoubleDollars ||
    jsMath.Moodle.processSlashParens ||
    jsMath.Moodle.processSlashBrackets ||
    jsMath.Moodle.fixEscapedDollars) {

  jsMath.Autoload.findCustomSettings = {
    processSingleDollars: jsMath.Moodle.processSingleDollars,
    processDoubleDollars: jsMath.Moodle.processDoubleDollars,
    processSlashParens:   jsMath.Moodle.processSlashParens,
    processSlashBrackets: jsMath.Moodle.processSlashBrackets,
    fixEscapedDollars:    jsMath.Moodle.fixEscapedDollars,
    custom: 0
  };
}

jsMath.Autoload.scripts = document.getElementsByTagName('script');
jsMath.Autoload.root = jsMath.Autoload.scripts[jsMath.Autoload.scripts.length-1].src;
jsMath.Autoload.root = jsMath.Autoload.root.replace('/lib/javascript-mod.php',
                                                    '/'+jsMath.Moodle.filter+'/jsMath/');
jsMath.Autoload.scripts = null;

jsMath.tex2math = {
  doubleDollarsAreInLine: jsMath.Moodle.doubleDollarsAreInLine,
  allowDisableTag:        jsMath.Moodle.allowDisableTag
}
if (jsMath.Moodle.mimetexCompatible) {
  if (!jsMath.Autoload.loadFiles) {jsMath.Autoload.loadFiles = []}
  if (typeof(jsMath.Autoload.loadFiles) == 'string')
    {jsMath.Autoload.loadFiles = [jsMath.Autoload.loadFiles]}
  jsMath.Autoload.loadFiles[jsMath.Autoload.loadFiles.length] = "plugins/mimeTeX.js";
}

jsMath.Controls = {cookie: {scale: jsMath.Moodle.scale, global: 'never'}};
if (!jsMath.Moodle.allowDoubleClicks) {
  jsMath.Click = {CheckDblClick: function () {}};
}
if (!jsMath.Moodle.showFontWarnings) {
  jsMath.Font = {Message: function () {}};
}

/*
 *  Hook into overlib() so that we check the contents for
 *  mathematics after it appears.
 */
jsMath.Moodle.overlib = function () {
  jsMath.Moodle.oldOverlib();
  if (jsMath.Moodle.overlibStarted) return;
  jsMath.Moodle.overlibStarted = 1;
  jsMath.Autoload.ReCheck();
  jsMath.Autoload.Run(document.getElementById('overDiv'));
  jsMath.Synchronize(
    "jsMath.Moodle.oldProgress = jsMath.Controls.cookie.progress;" +
    "jsMath.Controls.cookie.progress = 0;"
  );
  jsMath.ProcessBeforeShowing('overDiv');
  jsMath.Synchronize(
    "jsMath.Controls.cookie.progress = jsMath.Moodle.oldProgress;" +
    "jsMath.Moodle.overlibStarted = 0;"
  );
}

jsMath.noGoGlobal = 1;
jsMath.noChangeGlobal = 1;
jsMath.noShowGlobal = 1;
jsMath.safeHBoxes = 1;

jsMath.Moodle.onload = window.onload
window.onload = function () {
  jsMath.Moodle.oldOverlib = window.overlib;
  if (jsMath.Moodle.onload) {jsMath.Moodle.onload()} // call old handler
  if (document.getElementById("Process_jsMath")) {   // set by filter.php
    jsMath.Autoload.Check();
    jsMath.Process();
    if (jsMath.Moodle.processPopups) {
      //  Hook into overlib library
      jsMath.Synchronize(function () {window.overlib = jsMath.Moodle.overlib});
    }
  }
}

document.write('<script src="'+jsMath.Autoload.root+'plugins/autoload.js"></script>');
