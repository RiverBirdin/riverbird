"""
WTForms definitions for Admin Authentication, Password Reset, and Blog Management.
"""

from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, PasswordField, TextAreaField, SelectField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}

class LoginForm(FlaskForm):
    username_or_email = StringField('Username or Email', validators=[DataRequired(), Length(max=120)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class ForgotPasswordForm(FlaskForm):
    email = StringField('Email Address', validators=[DataRequired(), Email(), Length(max=120)])
    submit = SubmitField('Send Reset Link')


class ResetPasswordForm(FlaskForm):
    password = PasswordField('New Password', validators=[
        DataRequired(),
        Length(min=8, message="Password must be at least 8 characters long.")
    ])
    confirm_password = PasswordField('Confirm New Password', validators=[
        DataRequired(),
        EqualTo('password', message="Passwords must match.")
    ])
    submit = SubmitField('Reset Password')


class ChangePasswordForm(FlaskForm):
    current_password = PasswordField('Current Password', validators=[DataRequired()])
    new_password = PasswordField('New Password', validators=[
        DataRequired(),
        Length(min=8, message="New password must be at least 8 characters long.")
    ])
    confirm_password = PasswordField('Confirm New Password', validators=[
        DataRequired(),
        EqualTo('new_password', message="Passwords must match.")
    ])
    submit = SubmitField('Change Password')


class BlogForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=200)])
    slug = StringField('Slug', validators=[Optional(), Length(max=200)])
    description = TextAreaField('Short Description', validators=[DataRequired(), Length(max=500)])
    content = TextAreaField('Content', validators=[DataRequired()])
    category = SelectField('Category', choices=[
        ('Technology', 'Technology'),
        ('Marketing', 'Marketing'),
        ('Design', 'Design'),
        ('Business', 'Business'),
        ('Staffing', 'Staffing'),
        ('General', 'General')
    ], default='General')
    published = BooleanField('Publish Immediately', default=True)
    image = FileField('Featured Image', validators=[
        FileAllowed(ALLOWED_EXTENSIONS, 'Images only (jpg, jpeg, png, webp)!')
    ])
    submit = SubmitField('Save Blog Post')
