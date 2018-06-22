<html>
<head>
</head>
<body>
	<?php
		if(isset($_POST['name']) || isset($_POST['email1']) || isset($_POST['betreff']) || isset($_POST['text'])){
			$Empfaenger = "kundenservice@bok.de";
			$email_a = $_REQUEST['email1'];

			if(empty($_REQUEST['name']) || empty($_REQUEST['email1']) || empty($_REQUEST['text'])){
				echo "*Bitte f&uuml;llen Sie alle Felder aus: ";
			}
			elseif(filter_var($email_a, FILTER_VALIDATE_EMAIL)){
				$email = "Sie haben eine Anfrage über ihr Kontaktformular erhalten:\n\n";
				while(list($Formularfeld, $Wert)=each($_REQUEST)){
					if($Formularfeld=="name"){
						$Mailnachricht .= $Wert." hat ihnen folgende Nachricht gesendet:\n\n";
					}
					if($Formularfeld=="text"){
						$Mailnachricht .= $Wert."\n";
					}
				}
				$Mailnachricht .= "\nDatum/Zeit: ";
				$Mailnachricht .= date("d.m.Y H:i:s");
				$Mailbetreff .= $_REQUEST['betreff'];
				mail($Empfaenger, $Mailbetreff, $Mailnachricht, "From: ".$_REQUEST['email1']);
				echo "gesendet";
			}
			else{
				echo "*Bitte geben Sie eine g&uuml;ltige Email-Adresse ein!";
			}
		}
	?>
</body>
</html>