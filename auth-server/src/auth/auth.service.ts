import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService }    from '@nestjs/jwt';
import * as bcrypt       from 'bcrypt';
import { DeleteResult, Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from './schemas/couter.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 로그인 → 유저 검증 → JWT 발급
   */
  async login(
    U_LoginID: string,
    U_LoginPW: string,
  ): Promise<{ accessToken: string,message: string }> {
    if (!U_LoginID || !U_LoginPW) {
      throw new HttpException('아이디와 비밀번호를 입력하세요.', HttpStatus.BAD_REQUEST);
    }

    // 유저 조회 
    const user: User = await this.getUserListOne(U_LoginID);

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(U_LoginPW, user.U_LoginPW);
    if (!isMatch) {
      throw new HttpException('아이디 또는 비밀번호가 맞지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    // 3) 토큰 페이로드 구성 및 발급
    const payload = {
      U_ID:    user.U_ID,
      U_LoginID: user.U_LoginID,
      U_Role:   user.U_Role,
    };

    const accessToken = this.jwtService.sign(payload)
    return {
      accessToken,
      message: `${user.U_NickNm} 님, 로그인 성공! 토큰이 발행되었습니다.`,
    };
  }

   /**
   * 회원가입(유저등록)
   * 
   * 
   * @param U_LoginID 아이디(중복X)
   * @param U_LoginPW 비밀번호(암호화)
   * @param U_Nm 이름
   * @param U_NickNm 닉네임(중복X)
   * @param U_Role 권한(기본값 User)
   */
  async register(userData: Partial<User>): Promise<User> {
    const { U_LoginID, U_NickNm, U_LoginPW, U_Nm, U_Role } = userData;

    


    //아이디 중복체크
    const existingId = await this.userModel.findOne({ U_LoginID });
    if (existingId) {
      throw new HttpException('이미 존재하는 userID입니다.', HttpStatus.CONFLICT); //409 중복
    }

    //닉네임중복체크
    const existingNick = await this.userModel.findOne({ U_NickNm });
    if (existingNick) {
      throw new HttpException('이미 존재하는 닉네임입니다.', HttpStatus.CONFLICT);  //409 중복
    }

    // 카운터
    const counter = await this.counterModel.findOneAndUpdate(
      { id: 'U_ID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

     // 포맷팅된 ID 생성 (예: U_00000001)
    const paddedId = counter.seq.toString().padStart(8, '0');
    const U_ID = `U_${paddedId}`;

    //비밀번호암호화
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(U_LoginPW, salt);
    //날짜 형식변경
    // const today = new Date().toISOString().slice(0, 10);
    //권한설정(기본값 User)
    const roleToSave = U_Role || 'User';

    const newUser = new this.userModel({
      U_ID : U_ID,
      U_LoginID,
      U_NickNm,
      U_LoginPW: hashedPassword,
      U_Nm,
      U_Role: roleToSave,
      U_IsDel: 'N',
    });

    return newUser.save();
  }


  // 전체 유저 조회
  async getUserListAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  /**
   * 특정 유저 조회
   * @param U_LoginID 
   */
  async getUserListOne(U_LoginID: string): Promise<User> {
    const user = await this.userModel.findOne({ U_LoginID });
    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND); // 404 처리
    }
    return user;
  }

  // /**
  //  * 권한으로 조회
  //  * @param userRole 
  //  */
  // async getListUserByRole(userRole: string): Promise<User[]> {
  //   const user = await this.userModel.find({ userRole }).lean();
  //   const userCount = user.length;
  //   if (userCount===0) {
  //     throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND); // 404 처리
  //   }
  //   return user;
  // }

  // /**
  //  * 유저 소프트 삭제
  //  * @param userID 삭제할 유저의 ID 즉, 탈퇴
  //  */
  // async remove(userID: string): Promise<{ deleted: boolean }> {
  //   // 먼저 특정유저 가져옴
  //   const user = await this.getListUser(userID);
  //   if (!user) {
  //     throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND); //404
  //   }

  //   if (user.userIsDeleted === 'Y') {
  //     throw new HttpException('이미 삭제된 유저입니다.', HttpStatus.BAD_REQUEST); //400 
  //   }

  //   const today = new Date().toISOString().slice(0, 10);

  //   // isDeleted, deletedAt 업데이트
  //   await this.userModel.updateOne(
  //     { userID },
  //     { userIsDeleted: 'Y', userDelDe: today },
  //   );
  //   return { deleted: true };
  // }
  
    
  /**
   * 유저 하드 삭제 (개발용)
   * @param U_LoginID 
   */
  async hardRemove(U_LoginID: string): Promise<{ deleted: boolean }> {
    const result: DeleteResult = await this.userModel.deleteOne({ U_LoginID });

    if (result.deletedCount === 0) {
      throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    return { deleted: true };
  }
  
  /**
   * 데이터초기화 (개발용)
   */
  async resetUser() {
    await this.userModel.collection.drop();
  }

  
  // /**
  //  * 유저 수정
  //  * @param U_ID 수정 대상 유저의 ID
  //  * @param updateData 수정할 데이터 (userPW, userNickNm, userNm, userRole)
  //  */
  // async update(
  //   userID: string,
  //   updateData: Partial<User>,
  // ): Promise<User> {
  //   // 대상 유저 조회 (없으면 404)
  //   const user = await this.getListUser(userID);

  //   // 닉네임 변경 시 중복 체크
  //   if (
  //     updateData.userNickNm &&
  //     updateData.userNickNm !== user.userNickNm
  //   ) {
  //     const duplication = await this.userModel.findOne({
  //       userNickNm: updateData.userNickNm,
  //     });
  //     if (duplication) {
  //       throw new HttpException('이미 존재하는 닉네임입니다.', HttpStatus.CONFLICT); 
  //     }
  //   }

  //   // 비밀번호 변경 시 암호화(비밀번호 변경 안하면 안돔)
  //   if (updateData.userPW) {
  //     const salt = await bcrypt.genSalt();
  //     updateData.userPW = await bcrypt.hash(updateData.userPW, salt);
  //   }

  //   // 업데이트 수행, 업데이트된 문서를 반환
  //   const updated = await this.userModel.findOneAndUpdate(
  //     { userID },
  //     updateData,
  //     { new: true },
  //   );

  //   // 혹시 업데이트 실패 시(문서 없음) 404 처리
  //   if (!updated) {
  //     throw new HttpException('유저를 찾을 수 없습니다.',HttpStatus.NOT_FOUND);
  //   }

  //   return updated;
  // }
}
