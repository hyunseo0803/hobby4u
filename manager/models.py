from django.db import models
import secrets



class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)   
    nickname = models.CharField(max_length=100, blank=True, null=True)
    email =  models.EmailField(unique=True)
    contact = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    notification = models.CharField(max_length=100, blank=True, null=True)
    date = models.CharField(max_length=100, blank=True, null=True)
    pw = models.CharField(max_length=100)
    is_approve=models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'admin'
        db_table_comment = '관리자 정보 테이블'     


class AdminMessage(models.Model):
    num = models.AutoField(primary_key=True)
    writer = models.ForeignKey(Admin, models.DO_NOTHING, db_column='writer', blank=True, null=True)
    message = models.CharField(max_length=100, blank=True, null=True)
    date = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_message'

class Apply(models.Model):
    num = models.AutoField(primary_key=True)        
    id = models.ForeignKey('Member', models.DO_NOTHING, db_column='id', blank=True, null=True)
    class_id = models.ForeignKey('Class', models.DO_NOTHING, db_column='class_id', blank=True, null=True)  # Field renamed because it was a Python reserved word.

    class Meta:
        managed = False
        db_table = 'apply'
        db_table_comment = '클래스 신청테이블'      


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)      
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)     

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)     
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)   
    last_name = models.CharField(max_length=150)    
    email = models.CharField(max_length=254)        
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)      
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)      


class AuthUserUserPermissions(models.Model):        
    id = models.BigAutoField(primary_key=True)      
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'     
        unique_together = (('user', 'permission'),) 


class Blackmember(models.Model):
    id = models.OneToOneField('Member', models.DO_NOTHING, db_column='id', primary_key=True)
    admin_id = models.ForeignKey(Admin, models.DO_NOTHING)
    period = models.CharField(max_length=100, blank=True, null=True)
    date = models.CharField(max_length=100, blank=True, null=True)
    coment = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'blackmember'
        db_table_comment = '블랙 회원 정지 기간 및  사유'


class Class(models.Model):
    class_id = models.AutoField(primary_key=True)   
    id = models.ForeignKey('Member', models.DO_NOTHING, db_column='id')
    title = models.CharField(max_length=100)        
    info = models.CharField(max_length=1000, blank=True, null=True)
    date = models.DateField(max_length=100, blank=True, null=True)
    img = models.ImageField(db_column='Img',upload_to="firstimg/")  # Field name made lowercase.
    file = models.FileField(db_column='file',upload_to="firstfile/", blank=True, null=True) 
    theme = models.CharField(max_length=100, blank=True, null=True)
    people = models.CharField(max_length=100, blank=True, null=True)
    money = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    intro1_file = models.ImageField(upload_to="introimg/", blank=True, null=True)
    intro1_content = models.CharField(max_length=1000, blank=True, null=True)
    intro2_file = models.ImageField( upload_to="introimg/",blank=True, null=True)
    intro2_content = models.CharField(max_length=1000, blank=True, null=True)
    intro3_file = models.ImageField(upload_to="introimg/", blank=True, null=True)
    intro3_content = models.CharField(max_length=1000, blank=True, null=True)
    applyend = models.CharField(max_length=100, blank=True, null=True)
    activitystart = models.CharField(max_length=100, blank=True, null=True)
    activityend = models.CharField(max_length=100, blank=True, null=True)
    adress = models.CharField(max_length=100, blank=True, null=True)
    goodcount = models.IntegerField(blank=True, null=True, default=0)

    class Meta:
        managed = False
        db_table = 'class'
        db_table_comment = '클래스 정보'


class DayClassinfo(models.Model):
    num = models.AutoField(primary_key=True)        
    class_id = models.ForeignKey(Class, models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.
    sequence = models.CharField(max_length=100, blank=True, null=True)
    date = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    info = models.CharField(max_length=1000, blank=True, null=True)
    file = models.ImageField(upload_to="dayimg/", blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'day_classinfo'
        db_table_comment = '클래스의 활동일 별 계획 정보 (대면 비대면 포함)'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)  
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)     
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)    
    model = models.CharField(max_length=100)        

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),) 


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)      
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class ExamResult(models.Model):
    admin_id = models.ForeignKey(Admin, models.DO_NOTHING,db_column='admin_id')
    result = models.CharField(max_length=100, blank=True, null=True)
    coment = models.CharField(max_length=100, blank=True, null=True)
    num = models.AutoField(primary_key=True)        
    class_id = models.ForeignKey(Class, models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.
    date=models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'exam_result'
        db_table_comment = '클래스 심사 완료 테이블'     


class LikeClass(models.Model):
    num = models.AutoField(primary_key=True)        
    id = models.ForeignKey('Member', models.DO_NOTHING, db_column='id')
    class_id = models.ForeignKey(Class, models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.
    status=models.BooleanField(default=1)

    class Meta:
        managed = False
        db_table = 'like_class'
        db_table_comment = '클래스 찜하기 또는 좋아 요 테이블'


class LikeUser(models.Model):
    num = models.AutoField(primary_key=True)        
    push_user = models.CharField(max_length=100, blank=True, null=True)
    id = models.ForeignKey('Member', models.DO_NOTHING, db_column='id', blank=True, null=True, db_comment='receive')

    class Meta:
        managed = False
        db_table = 'like_user'
        db_table_comment = '멘토에게 좋아요 또는 찜 하기 테이블'


class Member(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    nickname = models.CharField(max_length=100)     
    email = models.CharField(max_length=100)        
    provider = models.CharField(max_length=100, blank=True, null=True)
    info = models.CharField(max_length=100, blank=True, null=True)
    profileimg = models.CharField(db_column='profileImg',max_length=200, blank=True, null=True)  # Field name made lowercase.
    updateprofile = models.ImageField(db_column='updateprofile', upload_to="userimg/",max_length=200, blank=True, null=True)  # Field name made lowercase.
    goodcount = models.CharField(db_column='goodCount', max_length=100, blank=True, null=True)  # Field name made lowercase.
    joindate = models.CharField(db_column='joinDate', max_length=100)  # Field name made lowercase.     

    class Meta:
        managed = False
        db_table = 'member'
        db_table_comment = '일반회원 및 블랙회원 테 이블'

class Performance(models.Model):
    num = models.AutoField(primary_key=True)        
    id = models.ForeignKey(Member, models.DO_NOTHING, db_column='id')
    file = models.FileField(max_length=100, upload_to="achive/",blank=True, null=True)
    link = models.CharField(max_length=100, blank=True, null=True)
    file_title = models.CharField(max_length=100, blank=True, null=True)
    link_title = models.CharField(max_length=100, blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'performance'
        db_table_comment = '회원별 성과물 테이블'   


class Review(models.Model):
    num = models.AutoField(primary_key=True)        
    id = models.ForeignKey(Member, models.DO_NOTHING, db_column='id', blank=True, null=True, db_comment='writer')
    class_id = models.ForeignKey(Class, models.DO_NOTHING, db_column='class_id', db_comment='receive')  # Field renamed because it was a Python reserved word.
    coment = models.CharField(max_length=100, blank=True, null=True)
    date = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'review'
        db_table_comment = '리뷰테이블'