from flask_mail import Mail, Message
from flask import current_app
import logging

mail = Mail()

def send_reset_email(to_email, reset_token):
    try:
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/{reset_token}"
        logging.info(f"Generated reset URL: {reset_url}")

        subject = "Password Reset Request"
        body = f"""
        Hello,

        To reset your password, please click the link below:
        {reset_url}

        If you did not request a password reset, please ignore this email.

        Thanks,
        Scholar Team
        """

        msg = Message(subject=subject, recipients=[to_email], body=body)
        mail.send(msg)
        return True
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
        return False
