Unicode True
SetCompressor LZMA
SetCompressionLevel 9
SetCompressorDictSize 32

Name "詞典精靈 DictSprite"
OutFile "DictSprite_Setup.exe"
InstallDir "$PROGRAMFILES\DictSprite"
InstallDirRegKey HKCU "Software\DictSprite" ""

Page Directory
Page InstFiles

Section
SetOutPath $INSTDIR
File DictSprite.exe
File DictSprite_CLI.exe
File cedict.txt
File Qt5Core.dll
File Qt5Gui.dll
File Qt5Widgets.dll
File platforms\qwindows.dll
WriteUninstaller Uninstall.exe
SectionEnd
