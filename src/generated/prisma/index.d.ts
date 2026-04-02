
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model University
 * 
 */
export type University = $Result.DefaultSelection<Prisma.$UniversityPayload>
/**
 * Model UniversityLocation
 * 
 */
export type UniversityLocation = $Result.DefaultSelection<Prisma.$UniversityLocationPayload>
/**
 * Model Program
 * 
 */
export type Program = $Result.DefaultSelection<Prisma.$ProgramPayload>
/**
 * Model ProgramUniversity
 * 
 */
export type ProgramUniversity = $Result.DefaultSelection<Prisma.$ProgramUniversityPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Auth
 * 
 */
export type Auth = $Result.DefaultSelection<Prisma.$AuthPayload>
/**
 * Model UserProgram
 * 
 */
export type UserProgram = $Result.DefaultSelection<Prisma.$UserProgramPayload>
/**
 * Model UserUniversity
 * 
 */
export type UserUniversity = $Result.DefaultSelection<Prisma.$UserUniversityPayload>
/**
 * Model MockTest
 * 
 */
export type MockTest = $Result.DefaultSelection<Prisma.$MockTestPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Universities
 * const universities = await prisma.university.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Universities
   * const universities = await prisma.university.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.university`: Exposes CRUD operations for the **University** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Universities
    * const universities = await prisma.university.findMany()
    * ```
    */
  get university(): Prisma.UniversityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.universityLocation`: Exposes CRUD operations for the **UniversityLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UniversityLocations
    * const universityLocations = await prisma.universityLocation.findMany()
    * ```
    */
  get universityLocation(): Prisma.UniversityLocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.program`: Exposes CRUD operations for the **Program** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Programs
    * const programs = await prisma.program.findMany()
    * ```
    */
  get program(): Prisma.ProgramDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.programUniversity`: Exposes CRUD operations for the **ProgramUniversity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProgramUniversities
    * const programUniversities = await prisma.programUniversity.findMany()
    * ```
    */
  get programUniversity(): Prisma.ProgramUniversityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auth`: Exposes CRUD operations for the **Auth** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Auths
    * const auths = await prisma.auth.findMany()
    * ```
    */
  get auth(): Prisma.AuthDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userProgram`: Exposes CRUD operations for the **UserProgram** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPrograms
    * const userPrograms = await prisma.userProgram.findMany()
    * ```
    */
  get userProgram(): Prisma.UserProgramDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userUniversity`: Exposes CRUD operations for the **UserUniversity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserUniversities
    * const userUniversities = await prisma.userUniversity.findMany()
    * ```
    */
  get userUniversity(): Prisma.UserUniversityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mockTest`: Exposes CRUD operations for the **MockTest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MockTests
    * const mockTests = await prisma.mockTest.findMany()
    * ```
    */
  get mockTest(): Prisma.MockTestDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    University: 'University',
    UniversityLocation: 'UniversityLocation',
    Program: 'Program',
    ProgramUniversity: 'ProgramUniversity',
    User: 'User',
    Auth: 'Auth',
    UserProgram: 'UserProgram',
    UserUniversity: 'UserUniversity',
    MockTest: 'MockTest'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "university" | "universityLocation" | "program" | "programUniversity" | "user" | "auth" | "userProgram" | "userUniversity" | "mockTest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      University: {
        payload: Prisma.$UniversityPayload<ExtArgs>
        fields: Prisma.UniversityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UniversityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UniversityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>
          }
          findFirst: {
            args: Prisma.UniversityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UniversityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>
          }
          findMany: {
            args: Prisma.UniversityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>[]
          }
          create: {
            args: Prisma.UniversityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>
          }
          createMany: {
            args: Prisma.UniversityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UniversityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>[]
          }
          delete: {
            args: Prisma.UniversityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>
          }
          update: {
            args: Prisma.UniversityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>
          }
          deleteMany: {
            args: Prisma.UniversityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UniversityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UniversityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>[]
          }
          upsert: {
            args: Prisma.UniversityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityPayload>
          }
          aggregate: {
            args: Prisma.UniversityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUniversity>
          }
          groupBy: {
            args: Prisma.UniversityGroupByArgs<ExtArgs>
            result: $Utils.Optional<UniversityGroupByOutputType>[]
          }
          count: {
            args: Prisma.UniversityCountArgs<ExtArgs>
            result: $Utils.Optional<UniversityCountAggregateOutputType> | number
          }
        }
      }
      UniversityLocation: {
        payload: Prisma.$UniversityLocationPayload<ExtArgs>
        fields: Prisma.UniversityLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UniversityLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UniversityLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>
          }
          findFirst: {
            args: Prisma.UniversityLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UniversityLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>
          }
          findMany: {
            args: Prisma.UniversityLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>[]
          }
          create: {
            args: Prisma.UniversityLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>
          }
          createMany: {
            args: Prisma.UniversityLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UniversityLocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>[]
          }
          delete: {
            args: Prisma.UniversityLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>
          }
          update: {
            args: Prisma.UniversityLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>
          }
          deleteMany: {
            args: Prisma.UniversityLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UniversityLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UniversityLocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>[]
          }
          upsert: {
            args: Prisma.UniversityLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversityLocationPayload>
          }
          aggregate: {
            args: Prisma.UniversityLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUniversityLocation>
          }
          groupBy: {
            args: Prisma.UniversityLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<UniversityLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.UniversityLocationCountArgs<ExtArgs>
            result: $Utils.Optional<UniversityLocationCountAggregateOutputType> | number
          }
        }
      }
      Program: {
        payload: Prisma.$ProgramPayload<ExtArgs>
        fields: Prisma.ProgramFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgramFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgramFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          findFirst: {
            args: Prisma.ProgramFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgramFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          findMany: {
            args: Prisma.ProgramFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>[]
          }
          create: {
            args: Prisma.ProgramCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          createMany: {
            args: Prisma.ProgramCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgramCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>[]
          }
          delete: {
            args: Prisma.ProgramDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          update: {
            args: Prisma.ProgramUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          deleteMany: {
            args: Prisma.ProgramDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgramUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgramUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>[]
          }
          upsert: {
            args: Prisma.ProgramUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramPayload>
          }
          aggregate: {
            args: Prisma.ProgramAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgram>
          }
          groupBy: {
            args: Prisma.ProgramGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgramGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgramCountArgs<ExtArgs>
            result: $Utils.Optional<ProgramCountAggregateOutputType> | number
          }
        }
      }
      ProgramUniversity: {
        payload: Prisma.$ProgramUniversityPayload<ExtArgs>
        fields: Prisma.ProgramUniversityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgramUniversityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgramUniversityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>
          }
          findFirst: {
            args: Prisma.ProgramUniversityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgramUniversityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>
          }
          findMany: {
            args: Prisma.ProgramUniversityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>[]
          }
          create: {
            args: Prisma.ProgramUniversityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>
          }
          createMany: {
            args: Prisma.ProgramUniversityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgramUniversityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>[]
          }
          delete: {
            args: Prisma.ProgramUniversityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>
          }
          update: {
            args: Prisma.ProgramUniversityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>
          }
          deleteMany: {
            args: Prisma.ProgramUniversityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgramUniversityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgramUniversityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>[]
          }
          upsert: {
            args: Prisma.ProgramUniversityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramUniversityPayload>
          }
          aggregate: {
            args: Prisma.ProgramUniversityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgramUniversity>
          }
          groupBy: {
            args: Prisma.ProgramUniversityGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgramUniversityGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgramUniversityCountArgs<ExtArgs>
            result: $Utils.Optional<ProgramUniversityCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Auth: {
        payload: Prisma.$AuthPayload<ExtArgs>
        fields: Prisma.AuthFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          findFirst: {
            args: Prisma.AuthFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          findMany: {
            args: Prisma.AuthFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          create: {
            args: Prisma.AuthCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          createMany: {
            args: Prisma.AuthCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          delete: {
            args: Prisma.AuthDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          update: {
            args: Prisma.AuthUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          deleteMany: {
            args: Prisma.AuthDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>[]
          }
          upsert: {
            args: Prisma.AuthUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthPayload>
          }
          aggregate: {
            args: Prisma.AuthAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuth>
          }
          groupBy: {
            args: Prisma.AuthGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthCountArgs<ExtArgs>
            result: $Utils.Optional<AuthCountAggregateOutputType> | number
          }
        }
      }
      UserProgram: {
        payload: Prisma.$UserProgramPayload<ExtArgs>
        fields: Prisma.UserProgramFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProgramFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProgramFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>
          }
          findFirst: {
            args: Prisma.UserProgramFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProgramFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>
          }
          findMany: {
            args: Prisma.UserProgramFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>[]
          }
          create: {
            args: Prisma.UserProgramCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>
          }
          createMany: {
            args: Prisma.UserProgramCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProgramCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>[]
          }
          delete: {
            args: Prisma.UserProgramDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>
          }
          update: {
            args: Prisma.UserProgramUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>
          }
          deleteMany: {
            args: Prisma.UserProgramDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProgramUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProgramUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>[]
          }
          upsert: {
            args: Prisma.UserProgramUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgramPayload>
          }
          aggregate: {
            args: Prisma.UserProgramAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProgram>
          }
          groupBy: {
            args: Prisma.UserProgramGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProgramGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProgramCountArgs<ExtArgs>
            result: $Utils.Optional<UserProgramCountAggregateOutputType> | number
          }
        }
      }
      UserUniversity: {
        payload: Prisma.$UserUniversityPayload<ExtArgs>
        fields: Prisma.UserUniversityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserUniversityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserUniversityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>
          }
          findFirst: {
            args: Prisma.UserUniversityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserUniversityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>
          }
          findMany: {
            args: Prisma.UserUniversityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>[]
          }
          create: {
            args: Prisma.UserUniversityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>
          }
          createMany: {
            args: Prisma.UserUniversityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserUniversityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>[]
          }
          delete: {
            args: Prisma.UserUniversityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>
          }
          update: {
            args: Prisma.UserUniversityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>
          }
          deleteMany: {
            args: Prisma.UserUniversityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUniversityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUniversityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>[]
          }
          upsert: {
            args: Prisma.UserUniversityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUniversityPayload>
          }
          aggregate: {
            args: Prisma.UserUniversityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserUniversity>
          }
          groupBy: {
            args: Prisma.UserUniversityGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserUniversityGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserUniversityCountArgs<ExtArgs>
            result: $Utils.Optional<UserUniversityCountAggregateOutputType> | number
          }
        }
      }
      MockTest: {
        payload: Prisma.$MockTestPayload<ExtArgs>
        fields: Prisma.MockTestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MockTestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MockTestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>
          }
          findFirst: {
            args: Prisma.MockTestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MockTestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>
          }
          findMany: {
            args: Prisma.MockTestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>[]
          }
          create: {
            args: Prisma.MockTestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>
          }
          createMany: {
            args: Prisma.MockTestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MockTestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>[]
          }
          delete: {
            args: Prisma.MockTestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>
          }
          update: {
            args: Prisma.MockTestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>
          }
          deleteMany: {
            args: Prisma.MockTestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MockTestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MockTestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>[]
          }
          upsert: {
            args: Prisma.MockTestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MockTestPayload>
          }
          aggregate: {
            args: Prisma.MockTestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMockTest>
          }
          groupBy: {
            args: Prisma.MockTestGroupByArgs<ExtArgs>
            result: $Utils.Optional<MockTestGroupByOutputType>[]
          }
          count: {
            args: Prisma.MockTestCountArgs<ExtArgs>
            result: $Utils.Optional<MockTestCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    university?: UniversityOmit
    universityLocation?: UniversityLocationOmit
    program?: ProgramOmit
    programUniversity?: ProgramUniversityOmit
    user?: UserOmit
    auth?: AuthOmit
    userProgram?: UserProgramOmit
    userUniversity?: UserUniversityOmit
    mockTest?: MockTestOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UniversityCountOutputType
   */

  export type UniversityCountOutputType = {
    programs: number
    locations: number
    usersSaved: number
  }

  export type UniversityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | UniversityCountOutputTypeCountProgramsArgs
    locations?: boolean | UniversityCountOutputTypeCountLocationsArgs
    usersSaved?: boolean | UniversityCountOutputTypeCountUsersSavedArgs
  }

  // Custom InputTypes
  /**
   * UniversityCountOutputType without action
   */
  export type UniversityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityCountOutputType
     */
    select?: UniversityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UniversityCountOutputType without action
   */
  export type UniversityCountOutputTypeCountProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramUniversityWhereInput
  }

  /**
   * UniversityCountOutputType without action
   */
  export type UniversityCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UniversityLocationWhereInput
  }

  /**
   * UniversityCountOutputType without action
   */
  export type UniversityCountOutputTypeCountUsersSavedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserUniversityWhereInput
  }


  /**
   * Count Type ProgramCountOutputType
   */

  export type ProgramCountOutputType = {
    universities: number
    userPrograms: number
    mockTests: number
  }

  export type ProgramCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    universities?: boolean | ProgramCountOutputTypeCountUniversitiesArgs
    userPrograms?: boolean | ProgramCountOutputTypeCountUserProgramsArgs
    mockTests?: boolean | ProgramCountOutputTypeCountMockTestsArgs
  }

  // Custom InputTypes
  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramCountOutputType
     */
    select?: ProgramCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeCountUniversitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramUniversityWhereInput
  }

  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeCountUserProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgramWhereInput
  }

  /**
   * ProgramCountOutputType without action
   */
  export type ProgramCountOutputTypeCountMockTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MockTestWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    mockTests: number
    savedPrograms: number
    savedUniversities: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mockTests?: boolean | UserCountOutputTypeCountMockTestsArgs
    savedPrograms?: boolean | UserCountOutputTypeCountSavedProgramsArgs
    savedUniversities?: boolean | UserCountOutputTypeCountSavedUniversitiesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMockTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MockTestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSavedProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgramWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSavedUniversitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserUniversityWhereInput
  }


  /**
   * Models
   */

  /**
   * Model University
   */

  export type AggregateUniversity = {
    _count: UniversityCountAggregateOutputType | null
    _avg: UniversityAvgAggregateOutputType | null
    _sum: UniversitySumAggregateOutputType | null
    _min: UniversityMinAggregateOutputType | null
    _max: UniversityMaxAggregateOutputType | null
  }

  export type UniversityAvgAggregateOutputType = {
    studentCount: number | null
  }

  export type UniversitySumAggregateOutputType = {
    studentCount: number | null
  }

  export type UniversityMinAggregateOutputType = {
    id: string | null
    oid: string | null
    name: string | null
    description: string | null
    logoUrl: string | null
    type: string | null
    municipality: string | null
    website: string | null
    email: string | null
    studentCount: number | null
    syncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UniversityMaxAggregateOutputType = {
    id: string | null
    oid: string | null
    name: string | null
    description: string | null
    logoUrl: string | null
    type: string | null
    municipality: string | null
    website: string | null
    email: string | null
    studentCount: number | null
    syncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UniversityCountAggregateOutputType = {
    id: number
    oid: number
    name: number
    description: number
    logoUrl: number
    type: number
    municipality: number
    website: number
    email: number
    studentCount: number
    syncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UniversityAvgAggregateInputType = {
    studentCount?: true
  }

  export type UniversitySumAggregateInputType = {
    studentCount?: true
  }

  export type UniversityMinAggregateInputType = {
    id?: true
    oid?: true
    name?: true
    description?: true
    logoUrl?: true
    type?: true
    municipality?: true
    website?: true
    email?: true
    studentCount?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UniversityMaxAggregateInputType = {
    id?: true
    oid?: true
    name?: true
    description?: true
    logoUrl?: true
    type?: true
    municipality?: true
    website?: true
    email?: true
    studentCount?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UniversityCountAggregateInputType = {
    id?: true
    oid?: true
    name?: true
    description?: true
    logoUrl?: true
    type?: true
    municipality?: true
    website?: true
    email?: true
    studentCount?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UniversityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which University to aggregate.
     */
    where?: UniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Universities to fetch.
     */
    orderBy?: UniversityOrderByWithRelationInput | UniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Universities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Universities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Universities
    **/
    _count?: true | UniversityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UniversityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UniversitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UniversityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UniversityMaxAggregateInputType
  }

  export type GetUniversityAggregateType<T extends UniversityAggregateArgs> = {
        [P in keyof T & keyof AggregateUniversity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUniversity[P]>
      : GetScalarType<T[P], AggregateUniversity[P]>
  }




  export type UniversityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UniversityWhereInput
    orderBy?: UniversityOrderByWithAggregationInput | UniversityOrderByWithAggregationInput[]
    by: UniversityScalarFieldEnum[] | UniversityScalarFieldEnum
    having?: UniversityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UniversityCountAggregateInputType | true
    _avg?: UniversityAvgAggregateInputType
    _sum?: UniversitySumAggregateInputType
    _min?: UniversityMinAggregateInputType
    _max?: UniversityMaxAggregateInputType
  }

  export type UniversityGroupByOutputType = {
    id: string
    oid: string
    name: string
    description: string | null
    logoUrl: string | null
    type: string
    municipality: string | null
    website: string | null
    email: string | null
    studentCount: number | null
    syncedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: UniversityCountAggregateOutputType | null
    _avg: UniversityAvgAggregateOutputType | null
    _sum: UniversitySumAggregateOutputType | null
    _min: UniversityMinAggregateOutputType | null
    _max: UniversityMaxAggregateOutputType | null
  }

  type GetUniversityGroupByPayload<T extends UniversityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UniversityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UniversityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UniversityGroupByOutputType[P]>
            : GetScalarType<T[P], UniversityGroupByOutputType[P]>
        }
      >
    >


  export type UniversitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    logoUrl?: boolean
    type?: boolean
    municipality?: boolean
    website?: boolean
    email?: boolean
    studentCount?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    programs?: boolean | University$programsArgs<ExtArgs>
    locations?: boolean | University$locationsArgs<ExtArgs>
    usersSaved?: boolean | University$usersSavedArgs<ExtArgs>
    _count?: boolean | UniversityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["university"]>

  export type UniversitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    logoUrl?: boolean
    type?: boolean
    municipality?: boolean
    website?: boolean
    email?: boolean
    studentCount?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["university"]>

  export type UniversitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    logoUrl?: boolean
    type?: boolean
    municipality?: boolean
    website?: boolean
    email?: boolean
    studentCount?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["university"]>

  export type UniversitySelectScalar = {
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    logoUrl?: boolean
    type?: boolean
    municipality?: boolean
    website?: boolean
    email?: boolean
    studentCount?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UniversityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "oid" | "name" | "description" | "logoUrl" | "type" | "municipality" | "website" | "email" | "studentCount" | "syncedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["university"]>
  export type UniversityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | University$programsArgs<ExtArgs>
    locations?: boolean | University$locationsArgs<ExtArgs>
    usersSaved?: boolean | University$usersSavedArgs<ExtArgs>
    _count?: boolean | UniversityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UniversityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UniversityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UniversityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "University"
    objects: {
      programs: Prisma.$ProgramUniversityPayload<ExtArgs>[]
      locations: Prisma.$UniversityLocationPayload<ExtArgs>[]
      usersSaved: Prisma.$UserUniversityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      oid: string
      name: string
      description: string | null
      logoUrl: string | null
      type: string
      municipality: string | null
      website: string | null
      email: string | null
      studentCount: number | null
      syncedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["university"]>
    composites: {}
  }

  type UniversityGetPayload<S extends boolean | null | undefined | UniversityDefaultArgs> = $Result.GetResult<Prisma.$UniversityPayload, S>

  type UniversityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UniversityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UniversityCountAggregateInputType | true
    }

  export interface UniversityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['University'], meta: { name: 'University' } }
    /**
     * Find zero or one University that matches the filter.
     * @param {UniversityFindUniqueArgs} args - Arguments to find a University
     * @example
     * // Get one University
     * const university = await prisma.university.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UniversityFindUniqueArgs>(args: SelectSubset<T, UniversityFindUniqueArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one University that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UniversityFindUniqueOrThrowArgs} args - Arguments to find a University
     * @example
     * // Get one University
     * const university = await prisma.university.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UniversityFindUniqueOrThrowArgs>(args: SelectSubset<T, UniversityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first University that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityFindFirstArgs} args - Arguments to find a University
     * @example
     * // Get one University
     * const university = await prisma.university.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UniversityFindFirstArgs>(args?: SelectSubset<T, UniversityFindFirstArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first University that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityFindFirstOrThrowArgs} args - Arguments to find a University
     * @example
     * // Get one University
     * const university = await prisma.university.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UniversityFindFirstOrThrowArgs>(args?: SelectSubset<T, UniversityFindFirstOrThrowArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Universities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Universities
     * const universities = await prisma.university.findMany()
     * 
     * // Get first 10 Universities
     * const universities = await prisma.university.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const universityWithIdOnly = await prisma.university.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UniversityFindManyArgs>(args?: SelectSubset<T, UniversityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a University.
     * @param {UniversityCreateArgs} args - Arguments to create a University.
     * @example
     * // Create one University
     * const University = await prisma.university.create({
     *   data: {
     *     // ... data to create a University
     *   }
     * })
     * 
     */
    create<T extends UniversityCreateArgs>(args: SelectSubset<T, UniversityCreateArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Universities.
     * @param {UniversityCreateManyArgs} args - Arguments to create many Universities.
     * @example
     * // Create many Universities
     * const university = await prisma.university.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UniversityCreateManyArgs>(args?: SelectSubset<T, UniversityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Universities and returns the data saved in the database.
     * @param {UniversityCreateManyAndReturnArgs} args - Arguments to create many Universities.
     * @example
     * // Create many Universities
     * const university = await prisma.university.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Universities and only return the `id`
     * const universityWithIdOnly = await prisma.university.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UniversityCreateManyAndReturnArgs>(args?: SelectSubset<T, UniversityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a University.
     * @param {UniversityDeleteArgs} args - Arguments to delete one University.
     * @example
     * // Delete one University
     * const University = await prisma.university.delete({
     *   where: {
     *     // ... filter to delete one University
     *   }
     * })
     * 
     */
    delete<T extends UniversityDeleteArgs>(args: SelectSubset<T, UniversityDeleteArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one University.
     * @param {UniversityUpdateArgs} args - Arguments to update one University.
     * @example
     * // Update one University
     * const university = await prisma.university.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UniversityUpdateArgs>(args: SelectSubset<T, UniversityUpdateArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Universities.
     * @param {UniversityDeleteManyArgs} args - Arguments to filter Universities to delete.
     * @example
     * // Delete a few Universities
     * const { count } = await prisma.university.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UniversityDeleteManyArgs>(args?: SelectSubset<T, UniversityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Universities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Universities
     * const university = await prisma.university.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UniversityUpdateManyArgs>(args: SelectSubset<T, UniversityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Universities and returns the data updated in the database.
     * @param {UniversityUpdateManyAndReturnArgs} args - Arguments to update many Universities.
     * @example
     * // Update many Universities
     * const university = await prisma.university.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Universities and only return the `id`
     * const universityWithIdOnly = await prisma.university.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UniversityUpdateManyAndReturnArgs>(args: SelectSubset<T, UniversityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one University.
     * @param {UniversityUpsertArgs} args - Arguments to update or create a University.
     * @example
     * // Update or create a University
     * const university = await prisma.university.upsert({
     *   create: {
     *     // ... data to create a University
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the University we want to update
     *   }
     * })
     */
    upsert<T extends UniversityUpsertArgs>(args: SelectSubset<T, UniversityUpsertArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Universities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityCountArgs} args - Arguments to filter Universities to count.
     * @example
     * // Count the number of Universities
     * const count = await prisma.university.count({
     *   where: {
     *     // ... the filter for the Universities we want to count
     *   }
     * })
    **/
    count<T extends UniversityCountArgs>(
      args?: Subset<T, UniversityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UniversityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a University.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UniversityAggregateArgs>(args: Subset<T, UniversityAggregateArgs>): Prisma.PrismaPromise<GetUniversityAggregateType<T>>

    /**
     * Group by University.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UniversityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UniversityGroupByArgs['orderBy'] }
        : { orderBy?: UniversityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UniversityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUniversityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the University model
   */
  readonly fields: UniversityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for University.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UniversityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    programs<T extends University$programsArgs<ExtArgs> = {}>(args?: Subset<T, University$programsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    locations<T extends University$locationsArgs<ExtArgs> = {}>(args?: Subset<T, University$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    usersSaved<T extends University$usersSavedArgs<ExtArgs> = {}>(args?: Subset<T, University$usersSavedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the University model
   */
  interface UniversityFieldRefs {
    readonly id: FieldRef<"University", 'String'>
    readonly oid: FieldRef<"University", 'String'>
    readonly name: FieldRef<"University", 'String'>
    readonly description: FieldRef<"University", 'String'>
    readonly logoUrl: FieldRef<"University", 'String'>
    readonly type: FieldRef<"University", 'String'>
    readonly municipality: FieldRef<"University", 'String'>
    readonly website: FieldRef<"University", 'String'>
    readonly email: FieldRef<"University", 'String'>
    readonly studentCount: FieldRef<"University", 'Int'>
    readonly syncedAt: FieldRef<"University", 'DateTime'>
    readonly createdAt: FieldRef<"University", 'DateTime'>
    readonly updatedAt: FieldRef<"University", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * University findUnique
   */
  export type UniversityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * Filter, which University to fetch.
     */
    where: UniversityWhereUniqueInput
  }

  /**
   * University findUniqueOrThrow
   */
  export type UniversityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * Filter, which University to fetch.
     */
    where: UniversityWhereUniqueInput
  }

  /**
   * University findFirst
   */
  export type UniversityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * Filter, which University to fetch.
     */
    where?: UniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Universities to fetch.
     */
    orderBy?: UniversityOrderByWithRelationInput | UniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Universities.
     */
    cursor?: UniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Universities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Universities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Universities.
     */
    distinct?: UniversityScalarFieldEnum | UniversityScalarFieldEnum[]
  }

  /**
   * University findFirstOrThrow
   */
  export type UniversityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * Filter, which University to fetch.
     */
    where?: UniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Universities to fetch.
     */
    orderBy?: UniversityOrderByWithRelationInput | UniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Universities.
     */
    cursor?: UniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Universities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Universities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Universities.
     */
    distinct?: UniversityScalarFieldEnum | UniversityScalarFieldEnum[]
  }

  /**
   * University findMany
   */
  export type UniversityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * Filter, which Universities to fetch.
     */
    where?: UniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Universities to fetch.
     */
    orderBy?: UniversityOrderByWithRelationInput | UniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Universities.
     */
    cursor?: UniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Universities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Universities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Universities.
     */
    distinct?: UniversityScalarFieldEnum | UniversityScalarFieldEnum[]
  }

  /**
   * University create
   */
  export type UniversityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * The data needed to create a University.
     */
    data: XOR<UniversityCreateInput, UniversityUncheckedCreateInput>
  }

  /**
   * University createMany
   */
  export type UniversityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Universities.
     */
    data: UniversityCreateManyInput | UniversityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * University createManyAndReturn
   */
  export type UniversityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * The data used to create many Universities.
     */
    data: UniversityCreateManyInput | UniversityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * University update
   */
  export type UniversityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * The data needed to update a University.
     */
    data: XOR<UniversityUpdateInput, UniversityUncheckedUpdateInput>
    /**
     * Choose, which University to update.
     */
    where: UniversityWhereUniqueInput
  }

  /**
   * University updateMany
   */
  export type UniversityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Universities.
     */
    data: XOR<UniversityUpdateManyMutationInput, UniversityUncheckedUpdateManyInput>
    /**
     * Filter which Universities to update
     */
    where?: UniversityWhereInput
    /**
     * Limit how many Universities to update.
     */
    limit?: number
  }

  /**
   * University updateManyAndReturn
   */
  export type UniversityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * The data used to update Universities.
     */
    data: XOR<UniversityUpdateManyMutationInput, UniversityUncheckedUpdateManyInput>
    /**
     * Filter which Universities to update
     */
    where?: UniversityWhereInput
    /**
     * Limit how many Universities to update.
     */
    limit?: number
  }

  /**
   * University upsert
   */
  export type UniversityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * The filter to search for the University to update in case it exists.
     */
    where: UniversityWhereUniqueInput
    /**
     * In case the University found by the `where` argument doesn't exist, create a new University with this data.
     */
    create: XOR<UniversityCreateInput, UniversityUncheckedCreateInput>
    /**
     * In case the University was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UniversityUpdateInput, UniversityUncheckedUpdateInput>
  }

  /**
   * University delete
   */
  export type UniversityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
    /**
     * Filter which University to delete.
     */
    where: UniversityWhereUniqueInput
  }

  /**
   * University deleteMany
   */
  export type UniversityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Universities to delete
     */
    where?: UniversityWhereInput
    /**
     * Limit how many Universities to delete.
     */
    limit?: number
  }

  /**
   * University.programs
   */
  export type University$programsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    where?: ProgramUniversityWhereInput
    orderBy?: ProgramUniversityOrderByWithRelationInput | ProgramUniversityOrderByWithRelationInput[]
    cursor?: ProgramUniversityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgramUniversityScalarFieldEnum | ProgramUniversityScalarFieldEnum[]
  }

  /**
   * University.locations
   */
  export type University$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    where?: UniversityLocationWhereInput
    orderBy?: UniversityLocationOrderByWithRelationInput | UniversityLocationOrderByWithRelationInput[]
    cursor?: UniversityLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UniversityLocationScalarFieldEnum | UniversityLocationScalarFieldEnum[]
  }

  /**
   * University.usersSaved
   */
  export type University$usersSavedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    where?: UserUniversityWhereInput
    orderBy?: UserUniversityOrderByWithRelationInput | UserUniversityOrderByWithRelationInput[]
    cursor?: UserUniversityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserUniversityScalarFieldEnum | UserUniversityScalarFieldEnum[]
  }

  /**
   * University without action
   */
  export type UniversityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the University
     */
    select?: UniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the University
     */
    omit?: UniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityInclude<ExtArgs> | null
  }


  /**
   * Model UniversityLocation
   */

  export type AggregateUniversityLocation = {
    _count: UniversityLocationCountAggregateOutputType | null
    _min: UniversityLocationMinAggregateOutputType | null
    _max: UniversityLocationMaxAggregateOutputType | null
  }

  export type UniversityLocationMinAggregateOutputType = {
    id: string | null
    universityId: string | null
    code: string | null
    name: string | null
  }

  export type UniversityLocationMaxAggregateOutputType = {
    id: string | null
    universityId: string | null
    code: string | null
    name: string | null
  }

  export type UniversityLocationCountAggregateOutputType = {
    id: number
    universityId: number
    code: number
    name: number
    _all: number
  }


  export type UniversityLocationMinAggregateInputType = {
    id?: true
    universityId?: true
    code?: true
    name?: true
  }

  export type UniversityLocationMaxAggregateInputType = {
    id?: true
    universityId?: true
    code?: true
    name?: true
  }

  export type UniversityLocationCountAggregateInputType = {
    id?: true
    universityId?: true
    code?: true
    name?: true
    _all?: true
  }

  export type UniversityLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UniversityLocation to aggregate.
     */
    where?: UniversityLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversityLocations to fetch.
     */
    orderBy?: UniversityLocationOrderByWithRelationInput | UniversityLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UniversityLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversityLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversityLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UniversityLocations
    **/
    _count?: true | UniversityLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UniversityLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UniversityLocationMaxAggregateInputType
  }

  export type GetUniversityLocationAggregateType<T extends UniversityLocationAggregateArgs> = {
        [P in keyof T & keyof AggregateUniversityLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUniversityLocation[P]>
      : GetScalarType<T[P], AggregateUniversityLocation[P]>
  }




  export type UniversityLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UniversityLocationWhereInput
    orderBy?: UniversityLocationOrderByWithAggregationInput | UniversityLocationOrderByWithAggregationInput[]
    by: UniversityLocationScalarFieldEnum[] | UniversityLocationScalarFieldEnum
    having?: UniversityLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UniversityLocationCountAggregateInputType | true
    _min?: UniversityLocationMinAggregateInputType
    _max?: UniversityLocationMaxAggregateInputType
  }

  export type UniversityLocationGroupByOutputType = {
    id: string
    universityId: string
    code: string
    name: string
    _count: UniversityLocationCountAggregateOutputType | null
    _min: UniversityLocationMinAggregateOutputType | null
    _max: UniversityLocationMaxAggregateOutputType | null
  }

  type GetUniversityLocationGroupByPayload<T extends UniversityLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UniversityLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UniversityLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UniversityLocationGroupByOutputType[P]>
            : GetScalarType<T[P], UniversityLocationGroupByOutputType[P]>
        }
      >
    >


  export type UniversityLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    universityId?: boolean
    code?: boolean
    name?: boolean
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["universityLocation"]>

  export type UniversityLocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    universityId?: boolean
    code?: boolean
    name?: boolean
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["universityLocation"]>

  export type UniversityLocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    universityId?: boolean
    code?: boolean
    name?: boolean
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["universityLocation"]>

  export type UniversityLocationSelectScalar = {
    id?: boolean
    universityId?: boolean
    code?: boolean
    name?: boolean
  }

  export type UniversityLocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "universityId" | "code" | "name", ExtArgs["result"]["universityLocation"]>
  export type UniversityLocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }
  export type UniversityLocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }
  export type UniversityLocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }

  export type $UniversityLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UniversityLocation"
    objects: {
      university: Prisma.$UniversityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      universityId: string
      code: string
      name: string
    }, ExtArgs["result"]["universityLocation"]>
    composites: {}
  }

  type UniversityLocationGetPayload<S extends boolean | null | undefined | UniversityLocationDefaultArgs> = $Result.GetResult<Prisma.$UniversityLocationPayload, S>

  type UniversityLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UniversityLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UniversityLocationCountAggregateInputType | true
    }

  export interface UniversityLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UniversityLocation'], meta: { name: 'UniversityLocation' } }
    /**
     * Find zero or one UniversityLocation that matches the filter.
     * @param {UniversityLocationFindUniqueArgs} args - Arguments to find a UniversityLocation
     * @example
     * // Get one UniversityLocation
     * const universityLocation = await prisma.universityLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UniversityLocationFindUniqueArgs>(args: SelectSubset<T, UniversityLocationFindUniqueArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UniversityLocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UniversityLocationFindUniqueOrThrowArgs} args - Arguments to find a UniversityLocation
     * @example
     * // Get one UniversityLocation
     * const universityLocation = await prisma.universityLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UniversityLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, UniversityLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UniversityLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityLocationFindFirstArgs} args - Arguments to find a UniversityLocation
     * @example
     * // Get one UniversityLocation
     * const universityLocation = await prisma.universityLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UniversityLocationFindFirstArgs>(args?: SelectSubset<T, UniversityLocationFindFirstArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UniversityLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityLocationFindFirstOrThrowArgs} args - Arguments to find a UniversityLocation
     * @example
     * // Get one UniversityLocation
     * const universityLocation = await prisma.universityLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UniversityLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, UniversityLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UniversityLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UniversityLocations
     * const universityLocations = await prisma.universityLocation.findMany()
     * 
     * // Get first 10 UniversityLocations
     * const universityLocations = await prisma.universityLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const universityLocationWithIdOnly = await prisma.universityLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UniversityLocationFindManyArgs>(args?: SelectSubset<T, UniversityLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UniversityLocation.
     * @param {UniversityLocationCreateArgs} args - Arguments to create a UniversityLocation.
     * @example
     * // Create one UniversityLocation
     * const UniversityLocation = await prisma.universityLocation.create({
     *   data: {
     *     // ... data to create a UniversityLocation
     *   }
     * })
     * 
     */
    create<T extends UniversityLocationCreateArgs>(args: SelectSubset<T, UniversityLocationCreateArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UniversityLocations.
     * @param {UniversityLocationCreateManyArgs} args - Arguments to create many UniversityLocations.
     * @example
     * // Create many UniversityLocations
     * const universityLocation = await prisma.universityLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UniversityLocationCreateManyArgs>(args?: SelectSubset<T, UniversityLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UniversityLocations and returns the data saved in the database.
     * @param {UniversityLocationCreateManyAndReturnArgs} args - Arguments to create many UniversityLocations.
     * @example
     * // Create many UniversityLocations
     * const universityLocation = await prisma.universityLocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UniversityLocations and only return the `id`
     * const universityLocationWithIdOnly = await prisma.universityLocation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UniversityLocationCreateManyAndReturnArgs>(args?: SelectSubset<T, UniversityLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UniversityLocation.
     * @param {UniversityLocationDeleteArgs} args - Arguments to delete one UniversityLocation.
     * @example
     * // Delete one UniversityLocation
     * const UniversityLocation = await prisma.universityLocation.delete({
     *   where: {
     *     // ... filter to delete one UniversityLocation
     *   }
     * })
     * 
     */
    delete<T extends UniversityLocationDeleteArgs>(args: SelectSubset<T, UniversityLocationDeleteArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UniversityLocation.
     * @param {UniversityLocationUpdateArgs} args - Arguments to update one UniversityLocation.
     * @example
     * // Update one UniversityLocation
     * const universityLocation = await prisma.universityLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UniversityLocationUpdateArgs>(args: SelectSubset<T, UniversityLocationUpdateArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UniversityLocations.
     * @param {UniversityLocationDeleteManyArgs} args - Arguments to filter UniversityLocations to delete.
     * @example
     * // Delete a few UniversityLocations
     * const { count } = await prisma.universityLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UniversityLocationDeleteManyArgs>(args?: SelectSubset<T, UniversityLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UniversityLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UniversityLocations
     * const universityLocation = await prisma.universityLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UniversityLocationUpdateManyArgs>(args: SelectSubset<T, UniversityLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UniversityLocations and returns the data updated in the database.
     * @param {UniversityLocationUpdateManyAndReturnArgs} args - Arguments to update many UniversityLocations.
     * @example
     * // Update many UniversityLocations
     * const universityLocation = await prisma.universityLocation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UniversityLocations and only return the `id`
     * const universityLocationWithIdOnly = await prisma.universityLocation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UniversityLocationUpdateManyAndReturnArgs>(args: SelectSubset<T, UniversityLocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UniversityLocation.
     * @param {UniversityLocationUpsertArgs} args - Arguments to update or create a UniversityLocation.
     * @example
     * // Update or create a UniversityLocation
     * const universityLocation = await prisma.universityLocation.upsert({
     *   create: {
     *     // ... data to create a UniversityLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UniversityLocation we want to update
     *   }
     * })
     */
    upsert<T extends UniversityLocationUpsertArgs>(args: SelectSubset<T, UniversityLocationUpsertArgs<ExtArgs>>): Prisma__UniversityLocationClient<$Result.GetResult<Prisma.$UniversityLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UniversityLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityLocationCountArgs} args - Arguments to filter UniversityLocations to count.
     * @example
     * // Count the number of UniversityLocations
     * const count = await prisma.universityLocation.count({
     *   where: {
     *     // ... the filter for the UniversityLocations we want to count
     *   }
     * })
    **/
    count<T extends UniversityLocationCountArgs>(
      args?: Subset<T, UniversityLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UniversityLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UniversityLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UniversityLocationAggregateArgs>(args: Subset<T, UniversityLocationAggregateArgs>): Prisma.PrismaPromise<GetUniversityLocationAggregateType<T>>

    /**
     * Group by UniversityLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversityLocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UniversityLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UniversityLocationGroupByArgs['orderBy'] }
        : { orderBy?: UniversityLocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UniversityLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUniversityLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UniversityLocation model
   */
  readonly fields: UniversityLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UniversityLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UniversityLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    university<T extends UniversityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UniversityDefaultArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UniversityLocation model
   */
  interface UniversityLocationFieldRefs {
    readonly id: FieldRef<"UniversityLocation", 'String'>
    readonly universityId: FieldRef<"UniversityLocation", 'String'>
    readonly code: FieldRef<"UniversityLocation", 'String'>
    readonly name: FieldRef<"UniversityLocation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UniversityLocation findUnique
   */
  export type UniversityLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * Filter, which UniversityLocation to fetch.
     */
    where: UniversityLocationWhereUniqueInput
  }

  /**
   * UniversityLocation findUniqueOrThrow
   */
  export type UniversityLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * Filter, which UniversityLocation to fetch.
     */
    where: UniversityLocationWhereUniqueInput
  }

  /**
   * UniversityLocation findFirst
   */
  export type UniversityLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * Filter, which UniversityLocation to fetch.
     */
    where?: UniversityLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversityLocations to fetch.
     */
    orderBy?: UniversityLocationOrderByWithRelationInput | UniversityLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UniversityLocations.
     */
    cursor?: UniversityLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversityLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversityLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UniversityLocations.
     */
    distinct?: UniversityLocationScalarFieldEnum | UniversityLocationScalarFieldEnum[]
  }

  /**
   * UniversityLocation findFirstOrThrow
   */
  export type UniversityLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * Filter, which UniversityLocation to fetch.
     */
    where?: UniversityLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversityLocations to fetch.
     */
    orderBy?: UniversityLocationOrderByWithRelationInput | UniversityLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UniversityLocations.
     */
    cursor?: UniversityLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversityLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversityLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UniversityLocations.
     */
    distinct?: UniversityLocationScalarFieldEnum | UniversityLocationScalarFieldEnum[]
  }

  /**
   * UniversityLocation findMany
   */
  export type UniversityLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * Filter, which UniversityLocations to fetch.
     */
    where?: UniversityLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversityLocations to fetch.
     */
    orderBy?: UniversityLocationOrderByWithRelationInput | UniversityLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UniversityLocations.
     */
    cursor?: UniversityLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversityLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversityLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UniversityLocations.
     */
    distinct?: UniversityLocationScalarFieldEnum | UniversityLocationScalarFieldEnum[]
  }

  /**
   * UniversityLocation create
   */
  export type UniversityLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * The data needed to create a UniversityLocation.
     */
    data: XOR<UniversityLocationCreateInput, UniversityLocationUncheckedCreateInput>
  }

  /**
   * UniversityLocation createMany
   */
  export type UniversityLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UniversityLocations.
     */
    data: UniversityLocationCreateManyInput | UniversityLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UniversityLocation createManyAndReturn
   */
  export type UniversityLocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * The data used to create many UniversityLocations.
     */
    data: UniversityLocationCreateManyInput | UniversityLocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UniversityLocation update
   */
  export type UniversityLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * The data needed to update a UniversityLocation.
     */
    data: XOR<UniversityLocationUpdateInput, UniversityLocationUncheckedUpdateInput>
    /**
     * Choose, which UniversityLocation to update.
     */
    where: UniversityLocationWhereUniqueInput
  }

  /**
   * UniversityLocation updateMany
   */
  export type UniversityLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UniversityLocations.
     */
    data: XOR<UniversityLocationUpdateManyMutationInput, UniversityLocationUncheckedUpdateManyInput>
    /**
     * Filter which UniversityLocations to update
     */
    where?: UniversityLocationWhereInput
    /**
     * Limit how many UniversityLocations to update.
     */
    limit?: number
  }

  /**
   * UniversityLocation updateManyAndReturn
   */
  export type UniversityLocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * The data used to update UniversityLocations.
     */
    data: XOR<UniversityLocationUpdateManyMutationInput, UniversityLocationUncheckedUpdateManyInput>
    /**
     * Filter which UniversityLocations to update
     */
    where?: UniversityLocationWhereInput
    /**
     * Limit how many UniversityLocations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UniversityLocation upsert
   */
  export type UniversityLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * The filter to search for the UniversityLocation to update in case it exists.
     */
    where: UniversityLocationWhereUniqueInput
    /**
     * In case the UniversityLocation found by the `where` argument doesn't exist, create a new UniversityLocation with this data.
     */
    create: XOR<UniversityLocationCreateInput, UniversityLocationUncheckedCreateInput>
    /**
     * In case the UniversityLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UniversityLocationUpdateInput, UniversityLocationUncheckedUpdateInput>
  }

  /**
   * UniversityLocation delete
   */
  export type UniversityLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
    /**
     * Filter which UniversityLocation to delete.
     */
    where: UniversityLocationWhereUniqueInput
  }

  /**
   * UniversityLocation deleteMany
   */
  export type UniversityLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UniversityLocations to delete
     */
    where?: UniversityLocationWhereInput
    /**
     * Limit how many UniversityLocations to delete.
     */
    limit?: number
  }

  /**
   * UniversityLocation without action
   */
  export type UniversityLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversityLocation
     */
    select?: UniversityLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UniversityLocation
     */
    omit?: UniversityLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversityLocationInclude<ExtArgs> | null
  }


  /**
   * Model Program
   */

  export type AggregateProgram = {
    _count: ProgramCountAggregateOutputType | null
    _avg: ProgramAvgAggregateOutputType | null
    _sum: ProgramSumAggregateOutputType | null
    _min: ProgramMinAggregateOutputType | null
    _max: ProgramMaxAggregateOutputType | null
  }

  export type ProgramAvgAggregateOutputType = {
    creditsAmount: number | null
  }

  export type ProgramSumAggregateOutputType = {
    creditsAmount: number | null
  }

  export type ProgramMinAggregateOutputType = {
    id: string | null
    oid: string | null
    name: string | null
    description: string | null
    type: string | null
    typePath: string | null
    isDegree: boolean | null
    imageUrl: string | null
    creditsAmount: number | null
    creditsUnit: string | null
    eqfLevel: string | null
    nqfLevel: string | null
    fieldOfStudy: string | null
    syncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramMaxAggregateOutputType = {
    id: string | null
    oid: string | null
    name: string | null
    description: string | null
    type: string | null
    typePath: string | null
    isDegree: boolean | null
    imageUrl: string | null
    creditsAmount: number | null
    creditsUnit: string | null
    eqfLevel: string | null
    nqfLevel: string | null
    fieldOfStudy: string | null
    syncedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramCountAggregateOutputType = {
    id: number
    oid: number
    name: number
    description: number
    type: number
    typePath: number
    isDegree: number
    imageUrl: number
    creditsAmount: number
    creditsUnit: number
    eqfLevel: number
    nqfLevel: number
    fieldOfStudy: number
    degreeTitles: number
    implementations: number
    syncedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProgramAvgAggregateInputType = {
    creditsAmount?: true
  }

  export type ProgramSumAggregateInputType = {
    creditsAmount?: true
  }

  export type ProgramMinAggregateInputType = {
    id?: true
    oid?: true
    name?: true
    description?: true
    type?: true
    typePath?: true
    isDegree?: true
    imageUrl?: true
    creditsAmount?: true
    creditsUnit?: true
    eqfLevel?: true
    nqfLevel?: true
    fieldOfStudy?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramMaxAggregateInputType = {
    id?: true
    oid?: true
    name?: true
    description?: true
    type?: true
    typePath?: true
    isDegree?: true
    imageUrl?: true
    creditsAmount?: true
    creditsUnit?: true
    eqfLevel?: true
    nqfLevel?: true
    fieldOfStudy?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramCountAggregateInputType = {
    id?: true
    oid?: true
    name?: true
    description?: true
    type?: true
    typePath?: true
    isDegree?: true
    imageUrl?: true
    creditsAmount?: true
    creditsUnit?: true
    eqfLevel?: true
    nqfLevel?: true
    fieldOfStudy?: true
    degreeTitles?: true
    implementations?: true
    syncedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProgramAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Program to aggregate.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Programs
    **/
    _count?: true | ProgramCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProgramAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProgramSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgramMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgramMaxAggregateInputType
  }

  export type GetProgramAggregateType<T extends ProgramAggregateArgs> = {
        [P in keyof T & keyof AggregateProgram]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgram[P]>
      : GetScalarType<T[P], AggregateProgram[P]>
  }




  export type ProgramGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramWhereInput
    orderBy?: ProgramOrderByWithAggregationInput | ProgramOrderByWithAggregationInput[]
    by: ProgramScalarFieldEnum[] | ProgramScalarFieldEnum
    having?: ProgramScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgramCountAggregateInputType | true
    _avg?: ProgramAvgAggregateInputType
    _sum?: ProgramSumAggregateInputType
    _min?: ProgramMinAggregateInputType
    _max?: ProgramMaxAggregateInputType
  }

  export type ProgramGroupByOutputType = {
    id: string
    oid: string
    name: string
    description: string | null
    type: string
    typePath: string | null
    isDegree: boolean
    imageUrl: string | null
    creditsAmount: number | null
    creditsUnit: string | null
    eqfLevel: string | null
    nqfLevel: string | null
    fieldOfStudy: string | null
    degreeTitles: string[]
    implementations: JsonValue | null
    syncedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: ProgramCountAggregateOutputType | null
    _avg: ProgramAvgAggregateOutputType | null
    _sum: ProgramSumAggregateOutputType | null
    _min: ProgramMinAggregateOutputType | null
    _max: ProgramMaxAggregateOutputType | null
  }

  type GetProgramGroupByPayload<T extends ProgramGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgramGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgramGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgramGroupByOutputType[P]>
            : GetScalarType<T[P], ProgramGroupByOutputType[P]>
        }
      >
    >


  export type ProgramSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    typePath?: boolean
    isDegree?: boolean
    imageUrl?: boolean
    creditsAmount?: boolean
    creditsUnit?: boolean
    eqfLevel?: boolean
    nqfLevel?: boolean
    fieldOfStudy?: boolean
    degreeTitles?: boolean
    implementations?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    universities?: boolean | Program$universitiesArgs<ExtArgs>
    userPrograms?: boolean | Program$userProgramsArgs<ExtArgs>
    mockTests?: boolean | Program$mockTestsArgs<ExtArgs>
    _count?: boolean | ProgramCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["program"]>

  export type ProgramSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    typePath?: boolean
    isDegree?: boolean
    imageUrl?: boolean
    creditsAmount?: boolean
    creditsUnit?: boolean
    eqfLevel?: boolean
    nqfLevel?: boolean
    fieldOfStudy?: boolean
    degreeTitles?: boolean
    implementations?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["program"]>

  export type ProgramSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    typePath?: boolean
    isDegree?: boolean
    imageUrl?: boolean
    creditsAmount?: boolean
    creditsUnit?: boolean
    eqfLevel?: boolean
    nqfLevel?: boolean
    fieldOfStudy?: boolean
    degreeTitles?: boolean
    implementations?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["program"]>

  export type ProgramSelectScalar = {
    id?: boolean
    oid?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    typePath?: boolean
    isDegree?: boolean
    imageUrl?: boolean
    creditsAmount?: boolean
    creditsUnit?: boolean
    eqfLevel?: boolean
    nqfLevel?: boolean
    fieldOfStudy?: boolean
    degreeTitles?: boolean
    implementations?: boolean
    syncedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProgramOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "oid" | "name" | "description" | "type" | "typePath" | "isDegree" | "imageUrl" | "creditsAmount" | "creditsUnit" | "eqfLevel" | "nqfLevel" | "fieldOfStudy" | "degreeTitles" | "implementations" | "syncedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["program"]>
  export type ProgramInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    universities?: boolean | Program$universitiesArgs<ExtArgs>
    userPrograms?: boolean | Program$userProgramsArgs<ExtArgs>
    mockTests?: boolean | Program$mockTestsArgs<ExtArgs>
    _count?: boolean | ProgramCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProgramIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProgramIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProgramPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Program"
    objects: {
      universities: Prisma.$ProgramUniversityPayload<ExtArgs>[]
      userPrograms: Prisma.$UserProgramPayload<ExtArgs>[]
      mockTests: Prisma.$MockTestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      oid: string
      name: string
      description: string | null
      type: string
      typePath: string | null
      isDegree: boolean
      imageUrl: string | null
      creditsAmount: number | null
      creditsUnit: string | null
      eqfLevel: string | null
      nqfLevel: string | null
      fieldOfStudy: string | null
      degreeTitles: string[]
      implementations: Prisma.JsonValue | null
      syncedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["program"]>
    composites: {}
  }

  type ProgramGetPayload<S extends boolean | null | undefined | ProgramDefaultArgs> = $Result.GetResult<Prisma.$ProgramPayload, S>

  type ProgramCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgramFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProgramCountAggregateInputType | true
    }

  export interface ProgramDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Program'], meta: { name: 'Program' } }
    /**
     * Find zero or one Program that matches the filter.
     * @param {ProgramFindUniqueArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgramFindUniqueArgs>(args: SelectSubset<T, ProgramFindUniqueArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Program that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgramFindUniqueOrThrowArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgramFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgramFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Program that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramFindFirstArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgramFindFirstArgs>(args?: SelectSubset<T, ProgramFindFirstArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Program that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramFindFirstOrThrowArgs} args - Arguments to find a Program
     * @example
     * // Get one Program
     * const program = await prisma.program.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgramFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgramFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Programs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Programs
     * const programs = await prisma.program.findMany()
     * 
     * // Get first 10 Programs
     * const programs = await prisma.program.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const programWithIdOnly = await prisma.program.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgramFindManyArgs>(args?: SelectSubset<T, ProgramFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Program.
     * @param {ProgramCreateArgs} args - Arguments to create a Program.
     * @example
     * // Create one Program
     * const Program = await prisma.program.create({
     *   data: {
     *     // ... data to create a Program
     *   }
     * })
     * 
     */
    create<T extends ProgramCreateArgs>(args: SelectSubset<T, ProgramCreateArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Programs.
     * @param {ProgramCreateManyArgs} args - Arguments to create many Programs.
     * @example
     * // Create many Programs
     * const program = await prisma.program.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgramCreateManyArgs>(args?: SelectSubset<T, ProgramCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Programs and returns the data saved in the database.
     * @param {ProgramCreateManyAndReturnArgs} args - Arguments to create many Programs.
     * @example
     * // Create many Programs
     * const program = await prisma.program.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Programs and only return the `id`
     * const programWithIdOnly = await prisma.program.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgramCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgramCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Program.
     * @param {ProgramDeleteArgs} args - Arguments to delete one Program.
     * @example
     * // Delete one Program
     * const Program = await prisma.program.delete({
     *   where: {
     *     // ... filter to delete one Program
     *   }
     * })
     * 
     */
    delete<T extends ProgramDeleteArgs>(args: SelectSubset<T, ProgramDeleteArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Program.
     * @param {ProgramUpdateArgs} args - Arguments to update one Program.
     * @example
     * // Update one Program
     * const program = await prisma.program.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgramUpdateArgs>(args: SelectSubset<T, ProgramUpdateArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Programs.
     * @param {ProgramDeleteManyArgs} args - Arguments to filter Programs to delete.
     * @example
     * // Delete a few Programs
     * const { count } = await prisma.program.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgramDeleteManyArgs>(args?: SelectSubset<T, ProgramDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Programs
     * const program = await prisma.program.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgramUpdateManyArgs>(args: SelectSubset<T, ProgramUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Programs and returns the data updated in the database.
     * @param {ProgramUpdateManyAndReturnArgs} args - Arguments to update many Programs.
     * @example
     * // Update many Programs
     * const program = await prisma.program.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Programs and only return the `id`
     * const programWithIdOnly = await prisma.program.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProgramUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgramUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Program.
     * @param {ProgramUpsertArgs} args - Arguments to update or create a Program.
     * @example
     * // Update or create a Program
     * const program = await prisma.program.upsert({
     *   create: {
     *     // ... data to create a Program
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Program we want to update
     *   }
     * })
     */
    upsert<T extends ProgramUpsertArgs>(args: SelectSubset<T, ProgramUpsertArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Programs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramCountArgs} args - Arguments to filter Programs to count.
     * @example
     * // Count the number of Programs
     * const count = await prisma.program.count({
     *   where: {
     *     // ... the filter for the Programs we want to count
     *   }
     * })
    **/
    count<T extends ProgramCountArgs>(
      args?: Subset<T, ProgramCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgramCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Program.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgramAggregateArgs>(args: Subset<T, ProgramAggregateArgs>): Prisma.PrismaPromise<GetProgramAggregateType<T>>

    /**
     * Group by Program.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgramGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgramGroupByArgs['orderBy'] }
        : { orderBy?: ProgramGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgramGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgramGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Program model
   */
  readonly fields: ProgramFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Program.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgramClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    universities<T extends Program$universitiesArgs<ExtArgs> = {}>(args?: Subset<T, Program$universitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userPrograms<T extends Program$userProgramsArgs<ExtArgs> = {}>(args?: Subset<T, Program$userProgramsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mockTests<T extends Program$mockTestsArgs<ExtArgs> = {}>(args?: Subset<T, Program$mockTestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Program model
   */
  interface ProgramFieldRefs {
    readonly id: FieldRef<"Program", 'String'>
    readonly oid: FieldRef<"Program", 'String'>
    readonly name: FieldRef<"Program", 'String'>
    readonly description: FieldRef<"Program", 'String'>
    readonly type: FieldRef<"Program", 'String'>
    readonly typePath: FieldRef<"Program", 'String'>
    readonly isDegree: FieldRef<"Program", 'Boolean'>
    readonly imageUrl: FieldRef<"Program", 'String'>
    readonly creditsAmount: FieldRef<"Program", 'Float'>
    readonly creditsUnit: FieldRef<"Program", 'String'>
    readonly eqfLevel: FieldRef<"Program", 'String'>
    readonly nqfLevel: FieldRef<"Program", 'String'>
    readonly fieldOfStudy: FieldRef<"Program", 'String'>
    readonly degreeTitles: FieldRef<"Program", 'String[]'>
    readonly implementations: FieldRef<"Program", 'Json'>
    readonly syncedAt: FieldRef<"Program", 'DateTime'>
    readonly createdAt: FieldRef<"Program", 'DateTime'>
    readonly updatedAt: FieldRef<"Program", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Program findUnique
   */
  export type ProgramFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program findUniqueOrThrow
   */
  export type ProgramFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program findFirst
   */
  export type ProgramFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programs.
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programs.
     */
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Program findFirstOrThrow
   */
  export type ProgramFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Program to fetch.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programs.
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programs.
     */
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Program findMany
   */
  export type ProgramFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter, which Programs to fetch.
     */
    where?: ProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programs to fetch.
     */
    orderBy?: ProgramOrderByWithRelationInput | ProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Programs.
     */
    cursor?: ProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programs.
     */
    distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[]
  }

  /**
   * Program create
   */
  export type ProgramCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * The data needed to create a Program.
     */
    data: XOR<ProgramCreateInput, ProgramUncheckedCreateInput>
  }

  /**
   * Program createMany
   */
  export type ProgramCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Programs.
     */
    data: ProgramCreateManyInput | ProgramCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Program createManyAndReturn
   */
  export type ProgramCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * The data used to create many Programs.
     */
    data: ProgramCreateManyInput | ProgramCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Program update
   */
  export type ProgramUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * The data needed to update a Program.
     */
    data: XOR<ProgramUpdateInput, ProgramUncheckedUpdateInput>
    /**
     * Choose, which Program to update.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program updateMany
   */
  export type ProgramUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Programs.
     */
    data: XOR<ProgramUpdateManyMutationInput, ProgramUncheckedUpdateManyInput>
    /**
     * Filter which Programs to update
     */
    where?: ProgramWhereInput
    /**
     * Limit how many Programs to update.
     */
    limit?: number
  }

  /**
   * Program updateManyAndReturn
   */
  export type ProgramUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * The data used to update Programs.
     */
    data: XOR<ProgramUpdateManyMutationInput, ProgramUncheckedUpdateManyInput>
    /**
     * Filter which Programs to update
     */
    where?: ProgramWhereInput
    /**
     * Limit how many Programs to update.
     */
    limit?: number
  }

  /**
   * Program upsert
   */
  export type ProgramUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * The filter to search for the Program to update in case it exists.
     */
    where: ProgramWhereUniqueInput
    /**
     * In case the Program found by the `where` argument doesn't exist, create a new Program with this data.
     */
    create: XOR<ProgramCreateInput, ProgramUncheckedCreateInput>
    /**
     * In case the Program was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgramUpdateInput, ProgramUncheckedUpdateInput>
  }

  /**
   * Program delete
   */
  export type ProgramDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
    /**
     * Filter which Program to delete.
     */
    where: ProgramWhereUniqueInput
  }

  /**
   * Program deleteMany
   */
  export type ProgramDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Programs to delete
     */
    where?: ProgramWhereInput
    /**
     * Limit how many Programs to delete.
     */
    limit?: number
  }

  /**
   * Program.universities
   */
  export type Program$universitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    where?: ProgramUniversityWhereInput
    orderBy?: ProgramUniversityOrderByWithRelationInput | ProgramUniversityOrderByWithRelationInput[]
    cursor?: ProgramUniversityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgramUniversityScalarFieldEnum | ProgramUniversityScalarFieldEnum[]
  }

  /**
   * Program.userPrograms
   */
  export type Program$userProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    where?: UserProgramWhereInput
    orderBy?: UserProgramOrderByWithRelationInput | UserProgramOrderByWithRelationInput[]
    cursor?: UserProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProgramScalarFieldEnum | UserProgramScalarFieldEnum[]
  }

  /**
   * Program.mockTests
   */
  export type Program$mockTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    where?: MockTestWhereInput
    orderBy?: MockTestOrderByWithRelationInput | MockTestOrderByWithRelationInput[]
    cursor?: MockTestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MockTestScalarFieldEnum | MockTestScalarFieldEnum[]
  }

  /**
   * Program without action
   */
  export type ProgramDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Program
     */
    select?: ProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Program
     */
    omit?: ProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramInclude<ExtArgs> | null
  }


  /**
   * Model ProgramUniversity
   */

  export type AggregateProgramUniversity = {
    _count: ProgramUniversityCountAggregateOutputType | null
    _min: ProgramUniversityMinAggregateOutputType | null
    _max: ProgramUniversityMaxAggregateOutputType | null
  }

  export type ProgramUniversityMinAggregateOutputType = {
    programId: string | null
    universityId: string | null
  }

  export type ProgramUniversityMaxAggregateOutputType = {
    programId: string | null
    universityId: string | null
  }

  export type ProgramUniversityCountAggregateOutputType = {
    programId: number
    universityId: number
    _all: number
  }


  export type ProgramUniversityMinAggregateInputType = {
    programId?: true
    universityId?: true
  }

  export type ProgramUniversityMaxAggregateInputType = {
    programId?: true
    universityId?: true
  }

  export type ProgramUniversityCountAggregateInputType = {
    programId?: true
    universityId?: true
    _all?: true
  }

  export type ProgramUniversityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgramUniversity to aggregate.
     */
    where?: ProgramUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramUniversities to fetch.
     */
    orderBy?: ProgramUniversityOrderByWithRelationInput | ProgramUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgramUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProgramUniversities
    **/
    _count?: true | ProgramUniversityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgramUniversityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgramUniversityMaxAggregateInputType
  }

  export type GetProgramUniversityAggregateType<T extends ProgramUniversityAggregateArgs> = {
        [P in keyof T & keyof AggregateProgramUniversity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgramUniversity[P]>
      : GetScalarType<T[P], AggregateProgramUniversity[P]>
  }




  export type ProgramUniversityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramUniversityWhereInput
    orderBy?: ProgramUniversityOrderByWithAggregationInput | ProgramUniversityOrderByWithAggregationInput[]
    by: ProgramUniversityScalarFieldEnum[] | ProgramUniversityScalarFieldEnum
    having?: ProgramUniversityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgramUniversityCountAggregateInputType | true
    _min?: ProgramUniversityMinAggregateInputType
    _max?: ProgramUniversityMaxAggregateInputType
  }

  export type ProgramUniversityGroupByOutputType = {
    programId: string
    universityId: string
    _count: ProgramUniversityCountAggregateOutputType | null
    _min: ProgramUniversityMinAggregateOutputType | null
    _max: ProgramUniversityMaxAggregateOutputType | null
  }

  type GetProgramUniversityGroupByPayload<T extends ProgramUniversityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgramUniversityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgramUniversityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgramUniversityGroupByOutputType[P]>
            : GetScalarType<T[P], ProgramUniversityGroupByOutputType[P]>
        }
      >
    >


  export type ProgramUniversitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    programId?: boolean
    universityId?: boolean
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programUniversity"]>

  export type ProgramUniversitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    programId?: boolean
    universityId?: boolean
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programUniversity"]>

  export type ProgramUniversitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    programId?: boolean
    universityId?: boolean
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programUniversity"]>

  export type ProgramUniversitySelectScalar = {
    programId?: boolean
    universityId?: boolean
  }

  export type ProgramUniversityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"programId" | "universityId", ExtArgs["result"]["programUniversity"]>
  export type ProgramUniversityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }
  export type ProgramUniversityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }
  export type ProgramUniversityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | ProgramDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }

  export type $ProgramUniversityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProgramUniversity"
    objects: {
      program: Prisma.$ProgramPayload<ExtArgs>
      university: Prisma.$UniversityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      programId: string
      universityId: string
    }, ExtArgs["result"]["programUniversity"]>
    composites: {}
  }

  type ProgramUniversityGetPayload<S extends boolean | null | undefined | ProgramUniversityDefaultArgs> = $Result.GetResult<Prisma.$ProgramUniversityPayload, S>

  type ProgramUniversityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgramUniversityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProgramUniversityCountAggregateInputType | true
    }

  export interface ProgramUniversityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProgramUniversity'], meta: { name: 'ProgramUniversity' } }
    /**
     * Find zero or one ProgramUniversity that matches the filter.
     * @param {ProgramUniversityFindUniqueArgs} args - Arguments to find a ProgramUniversity
     * @example
     * // Get one ProgramUniversity
     * const programUniversity = await prisma.programUniversity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgramUniversityFindUniqueArgs>(args: SelectSubset<T, ProgramUniversityFindUniqueArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProgramUniversity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgramUniversityFindUniqueOrThrowArgs} args - Arguments to find a ProgramUniversity
     * @example
     * // Get one ProgramUniversity
     * const programUniversity = await prisma.programUniversity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgramUniversityFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgramUniversityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProgramUniversity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUniversityFindFirstArgs} args - Arguments to find a ProgramUniversity
     * @example
     * // Get one ProgramUniversity
     * const programUniversity = await prisma.programUniversity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgramUniversityFindFirstArgs>(args?: SelectSubset<T, ProgramUniversityFindFirstArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProgramUniversity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUniversityFindFirstOrThrowArgs} args - Arguments to find a ProgramUniversity
     * @example
     * // Get one ProgramUniversity
     * const programUniversity = await prisma.programUniversity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgramUniversityFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgramUniversityFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProgramUniversities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUniversityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProgramUniversities
     * const programUniversities = await prisma.programUniversity.findMany()
     * 
     * // Get first 10 ProgramUniversities
     * const programUniversities = await prisma.programUniversity.findMany({ take: 10 })
     * 
     * // Only select the `programId`
     * const programUniversityWithProgramIdOnly = await prisma.programUniversity.findMany({ select: { programId: true } })
     * 
     */
    findMany<T extends ProgramUniversityFindManyArgs>(args?: SelectSubset<T, ProgramUniversityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProgramUniversity.
     * @param {ProgramUniversityCreateArgs} args - Arguments to create a ProgramUniversity.
     * @example
     * // Create one ProgramUniversity
     * const ProgramUniversity = await prisma.programUniversity.create({
     *   data: {
     *     // ... data to create a ProgramUniversity
     *   }
     * })
     * 
     */
    create<T extends ProgramUniversityCreateArgs>(args: SelectSubset<T, ProgramUniversityCreateArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProgramUniversities.
     * @param {ProgramUniversityCreateManyArgs} args - Arguments to create many ProgramUniversities.
     * @example
     * // Create many ProgramUniversities
     * const programUniversity = await prisma.programUniversity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgramUniversityCreateManyArgs>(args?: SelectSubset<T, ProgramUniversityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProgramUniversities and returns the data saved in the database.
     * @param {ProgramUniversityCreateManyAndReturnArgs} args - Arguments to create many ProgramUniversities.
     * @example
     * // Create many ProgramUniversities
     * const programUniversity = await prisma.programUniversity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProgramUniversities and only return the `programId`
     * const programUniversityWithProgramIdOnly = await prisma.programUniversity.createManyAndReturn({
     *   select: { programId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgramUniversityCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgramUniversityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProgramUniversity.
     * @param {ProgramUniversityDeleteArgs} args - Arguments to delete one ProgramUniversity.
     * @example
     * // Delete one ProgramUniversity
     * const ProgramUniversity = await prisma.programUniversity.delete({
     *   where: {
     *     // ... filter to delete one ProgramUniversity
     *   }
     * })
     * 
     */
    delete<T extends ProgramUniversityDeleteArgs>(args: SelectSubset<T, ProgramUniversityDeleteArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProgramUniversity.
     * @param {ProgramUniversityUpdateArgs} args - Arguments to update one ProgramUniversity.
     * @example
     * // Update one ProgramUniversity
     * const programUniversity = await prisma.programUniversity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgramUniversityUpdateArgs>(args: SelectSubset<T, ProgramUniversityUpdateArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProgramUniversities.
     * @param {ProgramUniversityDeleteManyArgs} args - Arguments to filter ProgramUniversities to delete.
     * @example
     * // Delete a few ProgramUniversities
     * const { count } = await prisma.programUniversity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgramUniversityDeleteManyArgs>(args?: SelectSubset<T, ProgramUniversityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgramUniversities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUniversityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProgramUniversities
     * const programUniversity = await prisma.programUniversity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgramUniversityUpdateManyArgs>(args: SelectSubset<T, ProgramUniversityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgramUniversities and returns the data updated in the database.
     * @param {ProgramUniversityUpdateManyAndReturnArgs} args - Arguments to update many ProgramUniversities.
     * @example
     * // Update many ProgramUniversities
     * const programUniversity = await prisma.programUniversity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProgramUniversities and only return the `programId`
     * const programUniversityWithProgramIdOnly = await prisma.programUniversity.updateManyAndReturn({
     *   select: { programId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProgramUniversityUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgramUniversityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProgramUniversity.
     * @param {ProgramUniversityUpsertArgs} args - Arguments to update or create a ProgramUniversity.
     * @example
     * // Update or create a ProgramUniversity
     * const programUniversity = await prisma.programUniversity.upsert({
     *   create: {
     *     // ... data to create a ProgramUniversity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProgramUniversity we want to update
     *   }
     * })
     */
    upsert<T extends ProgramUniversityUpsertArgs>(args: SelectSubset<T, ProgramUniversityUpsertArgs<ExtArgs>>): Prisma__ProgramUniversityClient<$Result.GetResult<Prisma.$ProgramUniversityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProgramUniversities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUniversityCountArgs} args - Arguments to filter ProgramUniversities to count.
     * @example
     * // Count the number of ProgramUniversities
     * const count = await prisma.programUniversity.count({
     *   where: {
     *     // ... the filter for the ProgramUniversities we want to count
     *   }
     * })
    **/
    count<T extends ProgramUniversityCountArgs>(
      args?: Subset<T, ProgramUniversityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgramUniversityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProgramUniversity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUniversityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgramUniversityAggregateArgs>(args: Subset<T, ProgramUniversityAggregateArgs>): Prisma.PrismaPromise<GetProgramUniversityAggregateType<T>>

    /**
     * Group by ProgramUniversity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramUniversityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgramUniversityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgramUniversityGroupByArgs['orderBy'] }
        : { orderBy?: ProgramUniversityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgramUniversityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgramUniversityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProgramUniversity model
   */
  readonly fields: ProgramUniversityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProgramUniversity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgramUniversityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    program<T extends ProgramDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramDefaultArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    university<T extends UniversityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UniversityDefaultArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProgramUniversity model
   */
  interface ProgramUniversityFieldRefs {
    readonly programId: FieldRef<"ProgramUniversity", 'String'>
    readonly universityId: FieldRef<"ProgramUniversity", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProgramUniversity findUnique
   */
  export type ProgramUniversityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * Filter, which ProgramUniversity to fetch.
     */
    where: ProgramUniversityWhereUniqueInput
  }

  /**
   * ProgramUniversity findUniqueOrThrow
   */
  export type ProgramUniversityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * Filter, which ProgramUniversity to fetch.
     */
    where: ProgramUniversityWhereUniqueInput
  }

  /**
   * ProgramUniversity findFirst
   */
  export type ProgramUniversityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * Filter, which ProgramUniversity to fetch.
     */
    where?: ProgramUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramUniversities to fetch.
     */
    orderBy?: ProgramUniversityOrderByWithRelationInput | ProgramUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgramUniversities.
     */
    cursor?: ProgramUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramUniversities.
     */
    distinct?: ProgramUniversityScalarFieldEnum | ProgramUniversityScalarFieldEnum[]
  }

  /**
   * ProgramUniversity findFirstOrThrow
   */
  export type ProgramUniversityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * Filter, which ProgramUniversity to fetch.
     */
    where?: ProgramUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramUniversities to fetch.
     */
    orderBy?: ProgramUniversityOrderByWithRelationInput | ProgramUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgramUniversities.
     */
    cursor?: ProgramUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramUniversities.
     */
    distinct?: ProgramUniversityScalarFieldEnum | ProgramUniversityScalarFieldEnum[]
  }

  /**
   * ProgramUniversity findMany
   */
  export type ProgramUniversityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * Filter, which ProgramUniversities to fetch.
     */
    where?: ProgramUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramUniversities to fetch.
     */
    orderBy?: ProgramUniversityOrderByWithRelationInput | ProgramUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProgramUniversities.
     */
    cursor?: ProgramUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramUniversities.
     */
    distinct?: ProgramUniversityScalarFieldEnum | ProgramUniversityScalarFieldEnum[]
  }

  /**
   * ProgramUniversity create
   */
  export type ProgramUniversityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * The data needed to create a ProgramUniversity.
     */
    data: XOR<ProgramUniversityCreateInput, ProgramUniversityUncheckedCreateInput>
  }

  /**
   * ProgramUniversity createMany
   */
  export type ProgramUniversityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProgramUniversities.
     */
    data: ProgramUniversityCreateManyInput | ProgramUniversityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgramUniversity createManyAndReturn
   */
  export type ProgramUniversityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * The data used to create many ProgramUniversities.
     */
    data: ProgramUniversityCreateManyInput | ProgramUniversityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProgramUniversity update
   */
  export type ProgramUniversityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * The data needed to update a ProgramUniversity.
     */
    data: XOR<ProgramUniversityUpdateInput, ProgramUniversityUncheckedUpdateInput>
    /**
     * Choose, which ProgramUniversity to update.
     */
    where: ProgramUniversityWhereUniqueInput
  }

  /**
   * ProgramUniversity updateMany
   */
  export type ProgramUniversityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProgramUniversities.
     */
    data: XOR<ProgramUniversityUpdateManyMutationInput, ProgramUniversityUncheckedUpdateManyInput>
    /**
     * Filter which ProgramUniversities to update
     */
    where?: ProgramUniversityWhereInput
    /**
     * Limit how many ProgramUniversities to update.
     */
    limit?: number
  }

  /**
   * ProgramUniversity updateManyAndReturn
   */
  export type ProgramUniversityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * The data used to update ProgramUniversities.
     */
    data: XOR<ProgramUniversityUpdateManyMutationInput, ProgramUniversityUncheckedUpdateManyInput>
    /**
     * Filter which ProgramUniversities to update
     */
    where?: ProgramUniversityWhereInput
    /**
     * Limit how many ProgramUniversities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProgramUniversity upsert
   */
  export type ProgramUniversityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * The filter to search for the ProgramUniversity to update in case it exists.
     */
    where: ProgramUniversityWhereUniqueInput
    /**
     * In case the ProgramUniversity found by the `where` argument doesn't exist, create a new ProgramUniversity with this data.
     */
    create: XOR<ProgramUniversityCreateInput, ProgramUniversityUncheckedCreateInput>
    /**
     * In case the ProgramUniversity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgramUniversityUpdateInput, ProgramUniversityUncheckedUpdateInput>
  }

  /**
   * ProgramUniversity delete
   */
  export type ProgramUniversityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
    /**
     * Filter which ProgramUniversity to delete.
     */
    where: ProgramUniversityWhereUniqueInput
  }

  /**
   * ProgramUniversity deleteMany
   */
  export type ProgramUniversityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgramUniversities to delete
     */
    where?: ProgramUniversityWhereInput
    /**
     * Limit how many ProgramUniversities to delete.
     */
    limit?: number
  }

  /**
   * ProgramUniversity without action
   */
  export type ProgramUniversityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramUniversity
     */
    select?: ProgramUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgramUniversity
     */
    omit?: ProgramUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramUniversityInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    emailVerifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    emailVerifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    firstName: number
    lastName: number
    emailVerifiedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    emailVerifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    emailVerifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    emailVerifiedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    firstName: string | null
    lastName: string | null
    emailVerifiedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    emailVerifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auth?: boolean | User$authArgs<ExtArgs>
    mockTests?: boolean | User$mockTestsArgs<ExtArgs>
    savedPrograms?: boolean | User$savedProgramsArgs<ExtArgs>
    savedUniversities?: boolean | User$savedUniversitiesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    emailVerifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    emailVerifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    emailVerifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "firstName" | "lastName" | "emailVerifiedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auth?: boolean | User$authArgs<ExtArgs>
    mockTests?: boolean | User$mockTestsArgs<ExtArgs>
    savedPrograms?: boolean | User$savedProgramsArgs<ExtArgs>
    savedUniversities?: boolean | User$savedUniversitiesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      auth: Prisma.$AuthPayload<ExtArgs> | null
      mockTests: Prisma.$MockTestPayload<ExtArgs>[]
      savedPrograms: Prisma.$UserProgramPayload<ExtArgs>[]
      savedUniversities: Prisma.$UserUniversityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      firstName: string | null
      lastName: string | null
      emailVerifiedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auth<T extends User$authArgs<ExtArgs> = {}>(args?: Subset<T, User$authArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    mockTests<T extends User$mockTestsArgs<ExtArgs> = {}>(args?: Subset<T, User$mockTestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    savedPrograms<T extends User$savedProgramsArgs<ExtArgs> = {}>(args?: Subset<T, User$savedProgramsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    savedUniversities<T extends User$savedUniversitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$savedUniversitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly emailVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.auth
   */
  export type User$authArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    where?: AuthWhereInput
  }

  /**
   * User.mockTests
   */
  export type User$mockTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    where?: MockTestWhereInput
    orderBy?: MockTestOrderByWithRelationInput | MockTestOrderByWithRelationInput[]
    cursor?: MockTestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MockTestScalarFieldEnum | MockTestScalarFieldEnum[]
  }

  /**
   * User.savedPrograms
   */
  export type User$savedProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    where?: UserProgramWhereInput
    orderBy?: UserProgramOrderByWithRelationInput | UserProgramOrderByWithRelationInput[]
    cursor?: UserProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProgramScalarFieldEnum | UserProgramScalarFieldEnum[]
  }

  /**
   * User.savedUniversities
   */
  export type User$savedUniversitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    where?: UserUniversityWhereInput
    orderBy?: UserUniversityOrderByWithRelationInput | UserUniversityOrderByWithRelationInput[]
    cursor?: UserUniversityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserUniversityScalarFieldEnum | UserUniversityScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Auth
   */

  export type AggregateAuth = {
    _count: AuthCountAggregateOutputType | null
    _min: AuthMinAggregateOutputType | null
    _max: AuthMaxAggregateOutputType | null
  }

  export type AuthMinAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshToken: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type AuthMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshToken: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type AuthCountAggregateOutputType = {
    id: number
    userId: number
    refreshToken: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type AuthMinAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    expiresAt?: true
  }

  export type AuthMaxAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    expiresAt?: true
  }

  export type AuthCountAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type AuthAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auth to aggregate.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Auths
    **/
    _count?: true | AuthCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthMaxAggregateInputType
  }

  export type GetAuthAggregateType<T extends AuthAggregateArgs> = {
        [P in keyof T & keyof AggregateAuth]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuth[P]>
      : GetScalarType<T[P], AggregateAuth[P]>
  }




  export type AuthGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthWhereInput
    orderBy?: AuthOrderByWithAggregationInput | AuthOrderByWithAggregationInput[]
    by: AuthScalarFieldEnum[] | AuthScalarFieldEnum
    having?: AuthScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthCountAggregateInputType | true
    _min?: AuthMinAggregateInputType
    _max?: AuthMaxAggregateInputType
  }

  export type AuthGroupByOutputType = {
    id: string
    userId: string
    refreshToken: string
    createdAt: Date
    expiresAt: Date
    _count: AuthCountAggregateOutputType | null
    _min: AuthMinAggregateOutputType | null
    _max: AuthMaxAggregateOutputType | null
  }

  type GetAuthGroupByPayload<T extends AuthGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthGroupByOutputType[P]>
            : GetScalarType<T[P], AuthGroupByOutputType[P]>
        }
      >
    >


  export type AuthSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auth"]>

  export type AuthSelectScalar = {
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type AuthOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "refreshToken" | "createdAt" | "expiresAt", ExtArgs["result"]["auth"]>
  export type AuthInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuthPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Auth"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      refreshToken: string
      createdAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["auth"]>
    composites: {}
  }

  type AuthGetPayload<S extends boolean | null | undefined | AuthDefaultArgs> = $Result.GetResult<Prisma.$AuthPayload, S>

  type AuthCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthCountAggregateInputType | true
    }

  export interface AuthDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Auth'], meta: { name: 'Auth' } }
    /**
     * Find zero or one Auth that matches the filter.
     * @param {AuthFindUniqueArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthFindUniqueArgs>(args: SelectSubset<T, AuthFindUniqueArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Auth that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthFindUniqueOrThrowArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindFirstArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthFindFirstArgs>(args?: SelectSubset<T, AuthFindFirstArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindFirstOrThrowArgs} args - Arguments to find a Auth
     * @example
     * // Get one Auth
     * const auth = await prisma.auth.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Auths that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Auths
     * const auths = await prisma.auth.findMany()
     * 
     * // Get first 10 Auths
     * const auths = await prisma.auth.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authWithIdOnly = await prisma.auth.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthFindManyArgs>(args?: SelectSubset<T, AuthFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Auth.
     * @param {AuthCreateArgs} args - Arguments to create a Auth.
     * @example
     * // Create one Auth
     * const Auth = await prisma.auth.create({
     *   data: {
     *     // ... data to create a Auth
     *   }
     * })
     * 
     */
    create<T extends AuthCreateArgs>(args: SelectSubset<T, AuthCreateArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Auths.
     * @param {AuthCreateManyArgs} args - Arguments to create many Auths.
     * @example
     * // Create many Auths
     * const auth = await prisma.auth.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthCreateManyArgs>(args?: SelectSubset<T, AuthCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Auths and returns the data saved in the database.
     * @param {AuthCreateManyAndReturnArgs} args - Arguments to create many Auths.
     * @example
     * // Create many Auths
     * const auth = await prisma.auth.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Auths and only return the `id`
     * const authWithIdOnly = await prisma.auth.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Auth.
     * @param {AuthDeleteArgs} args - Arguments to delete one Auth.
     * @example
     * // Delete one Auth
     * const Auth = await prisma.auth.delete({
     *   where: {
     *     // ... filter to delete one Auth
     *   }
     * })
     * 
     */
    delete<T extends AuthDeleteArgs>(args: SelectSubset<T, AuthDeleteArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Auth.
     * @param {AuthUpdateArgs} args - Arguments to update one Auth.
     * @example
     * // Update one Auth
     * const auth = await prisma.auth.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthUpdateArgs>(args: SelectSubset<T, AuthUpdateArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Auths.
     * @param {AuthDeleteManyArgs} args - Arguments to filter Auths to delete.
     * @example
     * // Delete a few Auths
     * const { count } = await prisma.auth.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthDeleteManyArgs>(args?: SelectSubset<T, AuthDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Auths
     * const auth = await prisma.auth.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthUpdateManyArgs>(args: SelectSubset<T, AuthUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auths and returns the data updated in the database.
     * @param {AuthUpdateManyAndReturnArgs} args - Arguments to update many Auths.
     * @example
     * // Update many Auths
     * const auth = await prisma.auth.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Auths and only return the `id`
     * const authWithIdOnly = await prisma.auth.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Auth.
     * @param {AuthUpsertArgs} args - Arguments to update or create a Auth.
     * @example
     * // Update or create a Auth
     * const auth = await prisma.auth.upsert({
     *   create: {
     *     // ... data to create a Auth
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Auth we want to update
     *   }
     * })
     */
    upsert<T extends AuthUpsertArgs>(args: SelectSubset<T, AuthUpsertArgs<ExtArgs>>): Prisma__AuthClient<$Result.GetResult<Prisma.$AuthPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Auths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthCountArgs} args - Arguments to filter Auths to count.
     * @example
     * // Count the number of Auths
     * const count = await prisma.auth.count({
     *   where: {
     *     // ... the filter for the Auths we want to count
     *   }
     * })
    **/
    count<T extends AuthCountArgs>(
      args?: Subset<T, AuthCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Auth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthAggregateArgs>(args: Subset<T, AuthAggregateArgs>): Prisma.PrismaPromise<GetAuthAggregateType<T>>

    /**
     * Group by Auth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthGroupByArgs['orderBy'] }
        : { orderBy?: AuthGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Auth model
   */
  readonly fields: AuthFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Auth.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Auth model
   */
  interface AuthFieldRefs {
    readonly id: FieldRef<"Auth", 'String'>
    readonly userId: FieldRef<"Auth", 'String'>
    readonly refreshToken: FieldRef<"Auth", 'String'>
    readonly createdAt: FieldRef<"Auth", 'DateTime'>
    readonly expiresAt: FieldRef<"Auth", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Auth findUnique
   */
  export type AuthFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth findUniqueOrThrow
   */
  export type AuthFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth findFirst
   */
  export type AuthFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auths.
     */
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth findFirstOrThrow
   */
  export type AuthFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auth to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auths.
     */
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth findMany
   */
  export type AuthFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter, which Auths to fetch.
     */
    where?: AuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auths to fetch.
     */
    orderBy?: AuthOrderByWithRelationInput | AuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Auths.
     */
    cursor?: AuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auths.
     */
    distinct?: AuthScalarFieldEnum | AuthScalarFieldEnum[]
  }

  /**
   * Auth create
   */
  export type AuthCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The data needed to create a Auth.
     */
    data: XOR<AuthCreateInput, AuthUncheckedCreateInput>
  }

  /**
   * Auth createMany
   */
  export type AuthCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Auths.
     */
    data: AuthCreateManyInput | AuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Auth createManyAndReturn
   */
  export type AuthCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * The data used to create many Auths.
     */
    data: AuthCreateManyInput | AuthCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Auth update
   */
  export type AuthUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The data needed to update a Auth.
     */
    data: XOR<AuthUpdateInput, AuthUncheckedUpdateInput>
    /**
     * Choose, which Auth to update.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth updateMany
   */
  export type AuthUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Auths.
     */
    data: XOR<AuthUpdateManyMutationInput, AuthUncheckedUpdateManyInput>
    /**
     * Filter which Auths to update
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to update.
     */
    limit?: number
  }

  /**
   * Auth updateManyAndReturn
   */
  export type AuthUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * The data used to update Auths.
     */
    data: XOR<AuthUpdateManyMutationInput, AuthUncheckedUpdateManyInput>
    /**
     * Filter which Auths to update
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Auth upsert
   */
  export type AuthUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * The filter to search for the Auth to update in case it exists.
     */
    where: AuthWhereUniqueInput
    /**
     * In case the Auth found by the `where` argument doesn't exist, create a new Auth with this data.
     */
    create: XOR<AuthCreateInput, AuthUncheckedCreateInput>
    /**
     * In case the Auth was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthUpdateInput, AuthUncheckedUpdateInput>
  }

  /**
   * Auth delete
   */
  export type AuthDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
    /**
     * Filter which Auth to delete.
     */
    where: AuthWhereUniqueInput
  }

  /**
   * Auth deleteMany
   */
  export type AuthDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auths to delete
     */
    where?: AuthWhereInput
    /**
     * Limit how many Auths to delete.
     */
    limit?: number
  }

  /**
   * Auth without action
   */
  export type AuthDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auth
     */
    select?: AuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Auth
     */
    omit?: AuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthInclude<ExtArgs> | null
  }


  /**
   * Model UserProgram
   */

  export type AggregateUserProgram = {
    _count: UserProgramCountAggregateOutputType | null
    _min: UserProgramMinAggregateOutputType | null
    _max: UserProgramMaxAggregateOutputType | null
  }

  export type UserProgramMinAggregateOutputType = {
    id: string | null
    userId: string | null
    programId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type UserProgramMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    programId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type UserProgramCountAggregateOutputType = {
    id: number
    userId: number
    programId: number
    status: number
    createdAt: number
    _all: number
  }


  export type UserProgramMinAggregateInputType = {
    id?: true
    userId?: true
    programId?: true
    status?: true
    createdAt?: true
  }

  export type UserProgramMaxAggregateInputType = {
    id?: true
    userId?: true
    programId?: true
    status?: true
    createdAt?: true
  }

  export type UserProgramCountAggregateInputType = {
    id?: true
    userId?: true
    programId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type UserProgramAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProgram to aggregate.
     */
    where?: UserProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPrograms to fetch.
     */
    orderBy?: UserProgramOrderByWithRelationInput | UserProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPrograms
    **/
    _count?: true | UserProgramCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProgramMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProgramMaxAggregateInputType
  }

  export type GetUserProgramAggregateType<T extends UserProgramAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProgram]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProgram[P]>
      : GetScalarType<T[P], AggregateUserProgram[P]>
  }




  export type UserProgramGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgramWhereInput
    orderBy?: UserProgramOrderByWithAggregationInput | UserProgramOrderByWithAggregationInput[]
    by: UserProgramScalarFieldEnum[] | UserProgramScalarFieldEnum
    having?: UserProgramScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProgramCountAggregateInputType | true
    _min?: UserProgramMinAggregateInputType
    _max?: UserProgramMaxAggregateInputType
  }

  export type UserProgramGroupByOutputType = {
    id: string
    userId: string
    programId: string
    status: string | null
    createdAt: Date
    _count: UserProgramCountAggregateOutputType | null
    _min: UserProgramMinAggregateOutputType | null
    _max: UserProgramMaxAggregateOutputType | null
  }

  type GetUserProgramGroupByPayload<T extends UserProgramGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProgramGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProgramGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProgramGroupByOutputType[P]>
            : GetScalarType<T[P], UserProgramGroupByOutputType[P]>
        }
      >
    >


  export type UserProgramSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programId?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgram"]>

  export type UserProgramSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programId?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgram"]>

  export type UserProgramSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programId?: boolean
    status?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgram"]>

  export type UserProgramSelectScalar = {
    id?: boolean
    userId?: boolean
    programId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type UserProgramOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "programId" | "status" | "createdAt", ExtArgs["result"]["userProgram"]>
  export type UserProgramInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }
  export type UserProgramIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }
  export type UserProgramIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }

  export type $UserProgramPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProgram"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      program: Prisma.$ProgramPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      programId: string
      status: string | null
      createdAt: Date
    }, ExtArgs["result"]["userProgram"]>
    composites: {}
  }

  type UserProgramGetPayload<S extends boolean | null | undefined | UserProgramDefaultArgs> = $Result.GetResult<Prisma.$UserProgramPayload, S>

  type UserProgramCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProgramFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProgramCountAggregateInputType | true
    }

  export interface UserProgramDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProgram'], meta: { name: 'UserProgram' } }
    /**
     * Find zero or one UserProgram that matches the filter.
     * @param {UserProgramFindUniqueArgs} args - Arguments to find a UserProgram
     * @example
     * // Get one UserProgram
     * const userProgram = await prisma.userProgram.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProgramFindUniqueArgs>(args: SelectSubset<T, UserProgramFindUniqueArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProgram that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProgramFindUniqueOrThrowArgs} args - Arguments to find a UserProgram
     * @example
     * // Get one UserProgram
     * const userProgram = await prisma.userProgram.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProgramFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProgramFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProgram that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgramFindFirstArgs} args - Arguments to find a UserProgram
     * @example
     * // Get one UserProgram
     * const userProgram = await prisma.userProgram.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProgramFindFirstArgs>(args?: SelectSubset<T, UserProgramFindFirstArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProgram that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgramFindFirstOrThrowArgs} args - Arguments to find a UserProgram
     * @example
     * // Get one UserProgram
     * const userProgram = await prisma.userProgram.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProgramFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProgramFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserPrograms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgramFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPrograms
     * const userPrograms = await prisma.userProgram.findMany()
     * 
     * // Get first 10 UserPrograms
     * const userPrograms = await prisma.userProgram.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProgramWithIdOnly = await prisma.userProgram.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProgramFindManyArgs>(args?: SelectSubset<T, UserProgramFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProgram.
     * @param {UserProgramCreateArgs} args - Arguments to create a UserProgram.
     * @example
     * // Create one UserProgram
     * const UserProgram = await prisma.userProgram.create({
     *   data: {
     *     // ... data to create a UserProgram
     *   }
     * })
     * 
     */
    create<T extends UserProgramCreateArgs>(args: SelectSubset<T, UserProgramCreateArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserPrograms.
     * @param {UserProgramCreateManyArgs} args - Arguments to create many UserPrograms.
     * @example
     * // Create many UserPrograms
     * const userProgram = await prisma.userProgram.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProgramCreateManyArgs>(args?: SelectSubset<T, UserProgramCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPrograms and returns the data saved in the database.
     * @param {UserProgramCreateManyAndReturnArgs} args - Arguments to create many UserPrograms.
     * @example
     * // Create many UserPrograms
     * const userProgram = await prisma.userProgram.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPrograms and only return the `id`
     * const userProgramWithIdOnly = await prisma.userProgram.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProgramCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProgramCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProgram.
     * @param {UserProgramDeleteArgs} args - Arguments to delete one UserProgram.
     * @example
     * // Delete one UserProgram
     * const UserProgram = await prisma.userProgram.delete({
     *   where: {
     *     // ... filter to delete one UserProgram
     *   }
     * })
     * 
     */
    delete<T extends UserProgramDeleteArgs>(args: SelectSubset<T, UserProgramDeleteArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProgram.
     * @param {UserProgramUpdateArgs} args - Arguments to update one UserProgram.
     * @example
     * // Update one UserProgram
     * const userProgram = await prisma.userProgram.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProgramUpdateArgs>(args: SelectSubset<T, UserProgramUpdateArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserPrograms.
     * @param {UserProgramDeleteManyArgs} args - Arguments to filter UserPrograms to delete.
     * @example
     * // Delete a few UserPrograms
     * const { count } = await prisma.userProgram.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProgramDeleteManyArgs>(args?: SelectSubset<T, UserProgramDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgramUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPrograms
     * const userProgram = await prisma.userProgram.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProgramUpdateManyArgs>(args: SelectSubset<T, UserProgramUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPrograms and returns the data updated in the database.
     * @param {UserProgramUpdateManyAndReturnArgs} args - Arguments to update many UserPrograms.
     * @example
     * // Update many UserPrograms
     * const userProgram = await prisma.userProgram.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserPrograms and only return the `id`
     * const userProgramWithIdOnly = await prisma.userProgram.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserProgramUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProgramUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProgram.
     * @param {UserProgramUpsertArgs} args - Arguments to update or create a UserProgram.
     * @example
     * // Update or create a UserProgram
     * const userProgram = await prisma.userProgram.upsert({
     *   create: {
     *     // ... data to create a UserProgram
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProgram we want to update
     *   }
     * })
     */
    upsert<T extends UserProgramUpsertArgs>(args: SelectSubset<T, UserProgramUpsertArgs<ExtArgs>>): Prisma__UserProgramClient<$Result.GetResult<Prisma.$UserProgramPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserPrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgramCountArgs} args - Arguments to filter UserPrograms to count.
     * @example
     * // Count the number of UserPrograms
     * const count = await prisma.userProgram.count({
     *   where: {
     *     // ... the filter for the UserPrograms we want to count
     *   }
     * })
    **/
    count<T extends UserProgramCountArgs>(
      args?: Subset<T, UserProgramCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProgramCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgramAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProgramAggregateArgs>(args: Subset<T, UserProgramAggregateArgs>): Prisma.PrismaPromise<GetUserProgramAggregateType<T>>

    /**
     * Group by UserProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgramGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProgramGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProgramGroupByArgs['orderBy'] }
        : { orderBy?: UserProgramGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProgramGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProgramGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProgram model
   */
  readonly fields: UserProgramFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProgram.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProgramClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    program<T extends ProgramDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramDefaultArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProgram model
   */
  interface UserProgramFieldRefs {
    readonly id: FieldRef<"UserProgram", 'String'>
    readonly userId: FieldRef<"UserProgram", 'String'>
    readonly programId: FieldRef<"UserProgram", 'String'>
    readonly status: FieldRef<"UserProgram", 'String'>
    readonly createdAt: FieldRef<"UserProgram", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProgram findUnique
   */
  export type UserProgramFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * Filter, which UserProgram to fetch.
     */
    where: UserProgramWhereUniqueInput
  }

  /**
   * UserProgram findUniqueOrThrow
   */
  export type UserProgramFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * Filter, which UserProgram to fetch.
     */
    where: UserProgramWhereUniqueInput
  }

  /**
   * UserProgram findFirst
   */
  export type UserProgramFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * Filter, which UserProgram to fetch.
     */
    where?: UserProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPrograms to fetch.
     */
    orderBy?: UserProgramOrderByWithRelationInput | UserProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPrograms.
     */
    cursor?: UserProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPrograms.
     */
    distinct?: UserProgramScalarFieldEnum | UserProgramScalarFieldEnum[]
  }

  /**
   * UserProgram findFirstOrThrow
   */
  export type UserProgramFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * Filter, which UserProgram to fetch.
     */
    where?: UserProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPrograms to fetch.
     */
    orderBy?: UserProgramOrderByWithRelationInput | UserProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPrograms.
     */
    cursor?: UserProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPrograms.
     */
    distinct?: UserProgramScalarFieldEnum | UserProgramScalarFieldEnum[]
  }

  /**
   * UserProgram findMany
   */
  export type UserProgramFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * Filter, which UserPrograms to fetch.
     */
    where?: UserProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPrograms to fetch.
     */
    orderBy?: UserProgramOrderByWithRelationInput | UserProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPrograms.
     */
    cursor?: UserProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPrograms.
     */
    distinct?: UserProgramScalarFieldEnum | UserProgramScalarFieldEnum[]
  }

  /**
   * UserProgram create
   */
  export type UserProgramCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProgram.
     */
    data: XOR<UserProgramCreateInput, UserProgramUncheckedCreateInput>
  }

  /**
   * UserProgram createMany
   */
  export type UserProgramCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPrograms.
     */
    data: UserProgramCreateManyInput | UserProgramCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProgram createManyAndReturn
   */
  export type UserProgramCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * The data used to create many UserPrograms.
     */
    data: UserProgramCreateManyInput | UserProgramCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProgram update
   */
  export type UserProgramUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProgram.
     */
    data: XOR<UserProgramUpdateInput, UserProgramUncheckedUpdateInput>
    /**
     * Choose, which UserProgram to update.
     */
    where: UserProgramWhereUniqueInput
  }

  /**
   * UserProgram updateMany
   */
  export type UserProgramUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPrograms.
     */
    data: XOR<UserProgramUpdateManyMutationInput, UserProgramUncheckedUpdateManyInput>
    /**
     * Filter which UserPrograms to update
     */
    where?: UserProgramWhereInput
    /**
     * Limit how many UserPrograms to update.
     */
    limit?: number
  }

  /**
   * UserProgram updateManyAndReturn
   */
  export type UserProgramUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * The data used to update UserPrograms.
     */
    data: XOR<UserProgramUpdateManyMutationInput, UserProgramUncheckedUpdateManyInput>
    /**
     * Filter which UserPrograms to update
     */
    where?: UserProgramWhereInput
    /**
     * Limit how many UserPrograms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProgram upsert
   */
  export type UserProgramUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProgram to update in case it exists.
     */
    where: UserProgramWhereUniqueInput
    /**
     * In case the UserProgram found by the `where` argument doesn't exist, create a new UserProgram with this data.
     */
    create: XOR<UserProgramCreateInput, UserProgramUncheckedCreateInput>
    /**
     * In case the UserProgram was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProgramUpdateInput, UserProgramUncheckedUpdateInput>
  }

  /**
   * UserProgram delete
   */
  export type UserProgramDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
    /**
     * Filter which UserProgram to delete.
     */
    where: UserProgramWhereUniqueInput
  }

  /**
   * UserProgram deleteMany
   */
  export type UserProgramDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPrograms to delete
     */
    where?: UserProgramWhereInput
    /**
     * Limit how many UserPrograms to delete.
     */
    limit?: number
  }

  /**
   * UserProgram without action
   */
  export type UserProgramDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgram
     */
    select?: UserProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgram
     */
    omit?: UserProgramOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgramInclude<ExtArgs> | null
  }


  /**
   * Model UserUniversity
   */

  export type AggregateUserUniversity = {
    _count: UserUniversityCountAggregateOutputType | null
    _min: UserUniversityMinAggregateOutputType | null
    _max: UserUniversityMaxAggregateOutputType | null
  }

  export type UserUniversityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    universityId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type UserUniversityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    universityId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type UserUniversityCountAggregateOutputType = {
    id: number
    userId: number
    universityId: number
    notes: number
    createdAt: number
    _all: number
  }


  export type UserUniversityMinAggregateInputType = {
    id?: true
    userId?: true
    universityId?: true
    notes?: true
    createdAt?: true
  }

  export type UserUniversityMaxAggregateInputType = {
    id?: true
    userId?: true
    universityId?: true
    notes?: true
    createdAt?: true
  }

  export type UserUniversityCountAggregateInputType = {
    id?: true
    userId?: true
    universityId?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type UserUniversityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserUniversity to aggregate.
     */
    where?: UserUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUniversities to fetch.
     */
    orderBy?: UserUniversityOrderByWithRelationInput | UserUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserUniversities
    **/
    _count?: true | UserUniversityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserUniversityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserUniversityMaxAggregateInputType
  }

  export type GetUserUniversityAggregateType<T extends UserUniversityAggregateArgs> = {
        [P in keyof T & keyof AggregateUserUniversity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserUniversity[P]>
      : GetScalarType<T[P], AggregateUserUniversity[P]>
  }




  export type UserUniversityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserUniversityWhereInput
    orderBy?: UserUniversityOrderByWithAggregationInput | UserUniversityOrderByWithAggregationInput[]
    by: UserUniversityScalarFieldEnum[] | UserUniversityScalarFieldEnum
    having?: UserUniversityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserUniversityCountAggregateInputType | true
    _min?: UserUniversityMinAggregateInputType
    _max?: UserUniversityMaxAggregateInputType
  }

  export type UserUniversityGroupByOutputType = {
    id: string
    userId: string
    universityId: string
    notes: string | null
    createdAt: Date
    _count: UserUniversityCountAggregateOutputType | null
    _min: UserUniversityMinAggregateOutputType | null
    _max: UserUniversityMaxAggregateOutputType | null
  }

  type GetUserUniversityGroupByPayload<T extends UserUniversityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserUniversityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserUniversityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserUniversityGroupByOutputType[P]>
            : GetScalarType<T[P], UserUniversityGroupByOutputType[P]>
        }
      >
    >


  export type UserUniversitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    universityId?: boolean
    notes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userUniversity"]>

  export type UserUniversitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    universityId?: boolean
    notes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userUniversity"]>

  export type UserUniversitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    universityId?: boolean
    notes?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userUniversity"]>

  export type UserUniversitySelectScalar = {
    id?: boolean
    userId?: boolean
    universityId?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type UserUniversityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "universityId" | "notes" | "createdAt", ExtArgs["result"]["userUniversity"]>
  export type UserUniversityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }
  export type UserUniversityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }
  export type UserUniversityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    university?: boolean | UniversityDefaultArgs<ExtArgs>
  }

  export type $UserUniversityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserUniversity"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      university: Prisma.$UniversityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      universityId: string
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["userUniversity"]>
    composites: {}
  }

  type UserUniversityGetPayload<S extends boolean | null | undefined | UserUniversityDefaultArgs> = $Result.GetResult<Prisma.$UserUniversityPayload, S>

  type UserUniversityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserUniversityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserUniversityCountAggregateInputType | true
    }

  export interface UserUniversityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserUniversity'], meta: { name: 'UserUniversity' } }
    /**
     * Find zero or one UserUniversity that matches the filter.
     * @param {UserUniversityFindUniqueArgs} args - Arguments to find a UserUniversity
     * @example
     * // Get one UserUniversity
     * const userUniversity = await prisma.userUniversity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserUniversityFindUniqueArgs>(args: SelectSubset<T, UserUniversityFindUniqueArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserUniversity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserUniversityFindUniqueOrThrowArgs} args - Arguments to find a UserUniversity
     * @example
     * // Get one UserUniversity
     * const userUniversity = await prisma.userUniversity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserUniversityFindUniqueOrThrowArgs>(args: SelectSubset<T, UserUniversityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserUniversity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUniversityFindFirstArgs} args - Arguments to find a UserUniversity
     * @example
     * // Get one UserUniversity
     * const userUniversity = await prisma.userUniversity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserUniversityFindFirstArgs>(args?: SelectSubset<T, UserUniversityFindFirstArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserUniversity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUniversityFindFirstOrThrowArgs} args - Arguments to find a UserUniversity
     * @example
     * // Get one UserUniversity
     * const userUniversity = await prisma.userUniversity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserUniversityFindFirstOrThrowArgs>(args?: SelectSubset<T, UserUniversityFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserUniversities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUniversityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserUniversities
     * const userUniversities = await prisma.userUniversity.findMany()
     * 
     * // Get first 10 UserUniversities
     * const userUniversities = await prisma.userUniversity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userUniversityWithIdOnly = await prisma.userUniversity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserUniversityFindManyArgs>(args?: SelectSubset<T, UserUniversityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserUniversity.
     * @param {UserUniversityCreateArgs} args - Arguments to create a UserUniversity.
     * @example
     * // Create one UserUniversity
     * const UserUniversity = await prisma.userUniversity.create({
     *   data: {
     *     // ... data to create a UserUniversity
     *   }
     * })
     * 
     */
    create<T extends UserUniversityCreateArgs>(args: SelectSubset<T, UserUniversityCreateArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserUniversities.
     * @param {UserUniversityCreateManyArgs} args - Arguments to create many UserUniversities.
     * @example
     * // Create many UserUniversities
     * const userUniversity = await prisma.userUniversity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserUniversityCreateManyArgs>(args?: SelectSubset<T, UserUniversityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserUniversities and returns the data saved in the database.
     * @param {UserUniversityCreateManyAndReturnArgs} args - Arguments to create many UserUniversities.
     * @example
     * // Create many UserUniversities
     * const userUniversity = await prisma.userUniversity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserUniversities and only return the `id`
     * const userUniversityWithIdOnly = await prisma.userUniversity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserUniversityCreateManyAndReturnArgs>(args?: SelectSubset<T, UserUniversityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserUniversity.
     * @param {UserUniversityDeleteArgs} args - Arguments to delete one UserUniversity.
     * @example
     * // Delete one UserUniversity
     * const UserUniversity = await prisma.userUniversity.delete({
     *   where: {
     *     // ... filter to delete one UserUniversity
     *   }
     * })
     * 
     */
    delete<T extends UserUniversityDeleteArgs>(args: SelectSubset<T, UserUniversityDeleteArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserUniversity.
     * @param {UserUniversityUpdateArgs} args - Arguments to update one UserUniversity.
     * @example
     * // Update one UserUniversity
     * const userUniversity = await prisma.userUniversity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUniversityUpdateArgs>(args: SelectSubset<T, UserUniversityUpdateArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserUniversities.
     * @param {UserUniversityDeleteManyArgs} args - Arguments to filter UserUniversities to delete.
     * @example
     * // Delete a few UserUniversities
     * const { count } = await prisma.userUniversity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserUniversityDeleteManyArgs>(args?: SelectSubset<T, UserUniversityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserUniversities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUniversityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserUniversities
     * const userUniversity = await prisma.userUniversity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUniversityUpdateManyArgs>(args: SelectSubset<T, UserUniversityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserUniversities and returns the data updated in the database.
     * @param {UserUniversityUpdateManyAndReturnArgs} args - Arguments to update many UserUniversities.
     * @example
     * // Update many UserUniversities
     * const userUniversity = await prisma.userUniversity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserUniversities and only return the `id`
     * const userUniversityWithIdOnly = await prisma.userUniversity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUniversityUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUniversityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserUniversity.
     * @param {UserUniversityUpsertArgs} args - Arguments to update or create a UserUniversity.
     * @example
     * // Update or create a UserUniversity
     * const userUniversity = await prisma.userUniversity.upsert({
     *   create: {
     *     // ... data to create a UserUniversity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserUniversity we want to update
     *   }
     * })
     */
    upsert<T extends UserUniversityUpsertArgs>(args: SelectSubset<T, UserUniversityUpsertArgs<ExtArgs>>): Prisma__UserUniversityClient<$Result.GetResult<Prisma.$UserUniversityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserUniversities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUniversityCountArgs} args - Arguments to filter UserUniversities to count.
     * @example
     * // Count the number of UserUniversities
     * const count = await prisma.userUniversity.count({
     *   where: {
     *     // ... the filter for the UserUniversities we want to count
     *   }
     * })
    **/
    count<T extends UserUniversityCountArgs>(
      args?: Subset<T, UserUniversityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserUniversityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserUniversity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUniversityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserUniversityAggregateArgs>(args: Subset<T, UserUniversityAggregateArgs>): Prisma.PrismaPromise<GetUserUniversityAggregateType<T>>

    /**
     * Group by UserUniversity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUniversityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserUniversityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserUniversityGroupByArgs['orderBy'] }
        : { orderBy?: UserUniversityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserUniversityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserUniversityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserUniversity model
   */
  readonly fields: UserUniversityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserUniversity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserUniversityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    university<T extends UniversityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UniversityDefaultArgs<ExtArgs>>): Prisma__UniversityClient<$Result.GetResult<Prisma.$UniversityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserUniversity model
   */
  interface UserUniversityFieldRefs {
    readonly id: FieldRef<"UserUniversity", 'String'>
    readonly userId: FieldRef<"UserUniversity", 'String'>
    readonly universityId: FieldRef<"UserUniversity", 'String'>
    readonly notes: FieldRef<"UserUniversity", 'String'>
    readonly createdAt: FieldRef<"UserUniversity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserUniversity findUnique
   */
  export type UserUniversityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * Filter, which UserUniversity to fetch.
     */
    where: UserUniversityWhereUniqueInput
  }

  /**
   * UserUniversity findUniqueOrThrow
   */
  export type UserUniversityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * Filter, which UserUniversity to fetch.
     */
    where: UserUniversityWhereUniqueInput
  }

  /**
   * UserUniversity findFirst
   */
  export type UserUniversityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * Filter, which UserUniversity to fetch.
     */
    where?: UserUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUniversities to fetch.
     */
    orderBy?: UserUniversityOrderByWithRelationInput | UserUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserUniversities.
     */
    cursor?: UserUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserUniversities.
     */
    distinct?: UserUniversityScalarFieldEnum | UserUniversityScalarFieldEnum[]
  }

  /**
   * UserUniversity findFirstOrThrow
   */
  export type UserUniversityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * Filter, which UserUniversity to fetch.
     */
    where?: UserUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUniversities to fetch.
     */
    orderBy?: UserUniversityOrderByWithRelationInput | UserUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserUniversities.
     */
    cursor?: UserUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserUniversities.
     */
    distinct?: UserUniversityScalarFieldEnum | UserUniversityScalarFieldEnum[]
  }

  /**
   * UserUniversity findMany
   */
  export type UserUniversityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * Filter, which UserUniversities to fetch.
     */
    where?: UserUniversityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUniversities to fetch.
     */
    orderBy?: UserUniversityOrderByWithRelationInput | UserUniversityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserUniversities.
     */
    cursor?: UserUniversityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUniversities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUniversities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserUniversities.
     */
    distinct?: UserUniversityScalarFieldEnum | UserUniversityScalarFieldEnum[]
  }

  /**
   * UserUniversity create
   */
  export type UserUniversityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * The data needed to create a UserUniversity.
     */
    data: XOR<UserUniversityCreateInput, UserUniversityUncheckedCreateInput>
  }

  /**
   * UserUniversity createMany
   */
  export type UserUniversityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserUniversities.
     */
    data: UserUniversityCreateManyInput | UserUniversityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserUniversity createManyAndReturn
   */
  export type UserUniversityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * The data used to create many UserUniversities.
     */
    data: UserUniversityCreateManyInput | UserUniversityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserUniversity update
   */
  export type UserUniversityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * The data needed to update a UserUniversity.
     */
    data: XOR<UserUniversityUpdateInput, UserUniversityUncheckedUpdateInput>
    /**
     * Choose, which UserUniversity to update.
     */
    where: UserUniversityWhereUniqueInput
  }

  /**
   * UserUniversity updateMany
   */
  export type UserUniversityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserUniversities.
     */
    data: XOR<UserUniversityUpdateManyMutationInput, UserUniversityUncheckedUpdateManyInput>
    /**
     * Filter which UserUniversities to update
     */
    where?: UserUniversityWhereInput
    /**
     * Limit how many UserUniversities to update.
     */
    limit?: number
  }

  /**
   * UserUniversity updateManyAndReturn
   */
  export type UserUniversityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * The data used to update UserUniversities.
     */
    data: XOR<UserUniversityUpdateManyMutationInput, UserUniversityUncheckedUpdateManyInput>
    /**
     * Filter which UserUniversities to update
     */
    where?: UserUniversityWhereInput
    /**
     * Limit how many UserUniversities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserUniversity upsert
   */
  export type UserUniversityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * The filter to search for the UserUniversity to update in case it exists.
     */
    where: UserUniversityWhereUniqueInput
    /**
     * In case the UserUniversity found by the `where` argument doesn't exist, create a new UserUniversity with this data.
     */
    create: XOR<UserUniversityCreateInput, UserUniversityUncheckedCreateInput>
    /**
     * In case the UserUniversity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUniversityUpdateInput, UserUniversityUncheckedUpdateInput>
  }

  /**
   * UserUniversity delete
   */
  export type UserUniversityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
    /**
     * Filter which UserUniversity to delete.
     */
    where: UserUniversityWhereUniqueInput
  }

  /**
   * UserUniversity deleteMany
   */
  export type UserUniversityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserUniversities to delete
     */
    where?: UserUniversityWhereInput
    /**
     * Limit how many UserUniversities to delete.
     */
    limit?: number
  }

  /**
   * UserUniversity without action
   */
  export type UserUniversityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUniversity
     */
    select?: UserUniversitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserUniversity
     */
    omit?: UserUniversityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserUniversityInclude<ExtArgs> | null
  }


  /**
   * Model MockTest
   */

  export type AggregateMockTest = {
    _count: MockTestCountAggregateOutputType | null
    _avg: MockTestAvgAggregateOutputType | null
    _sum: MockTestSumAggregateOutputType | null
    _min: MockTestMinAggregateOutputType | null
    _max: MockTestMaxAggregateOutputType | null
  }

  export type MockTestAvgAggregateOutputType = {
    score: number | null
    maxScore: number | null
    timeTakenMinutes: number | null
  }

  export type MockTestSumAggregateOutputType = {
    score: number | null
    maxScore: number | null
    timeTakenMinutes: number | null
  }

  export type MockTestMinAggregateOutputType = {
    id: string | null
    userId: string | null
    programId: string | null
    score: number | null
    maxScore: number | null
    timeTakenMinutes: number | null
    status: string | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type MockTestMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    programId: string | null
    score: number | null
    maxScore: number | null
    timeTakenMinutes: number | null
    status: string | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type MockTestCountAggregateOutputType = {
    id: number
    userId: number
    programId: number
    score: number
    maxScore: number
    timeTakenMinutes: number
    status: number
    completedAt: number
    createdAt: number
    _all: number
  }


  export type MockTestAvgAggregateInputType = {
    score?: true
    maxScore?: true
    timeTakenMinutes?: true
  }

  export type MockTestSumAggregateInputType = {
    score?: true
    maxScore?: true
    timeTakenMinutes?: true
  }

  export type MockTestMinAggregateInputType = {
    id?: true
    userId?: true
    programId?: true
    score?: true
    maxScore?: true
    timeTakenMinutes?: true
    status?: true
    completedAt?: true
    createdAt?: true
  }

  export type MockTestMaxAggregateInputType = {
    id?: true
    userId?: true
    programId?: true
    score?: true
    maxScore?: true
    timeTakenMinutes?: true
    status?: true
    completedAt?: true
    createdAt?: true
  }

  export type MockTestCountAggregateInputType = {
    id?: true
    userId?: true
    programId?: true
    score?: true
    maxScore?: true
    timeTakenMinutes?: true
    status?: true
    completedAt?: true
    createdAt?: true
    _all?: true
  }

  export type MockTestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MockTest to aggregate.
     */
    where?: MockTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockTests to fetch.
     */
    orderBy?: MockTestOrderByWithRelationInput | MockTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MockTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MockTests
    **/
    _count?: true | MockTestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MockTestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MockTestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MockTestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MockTestMaxAggregateInputType
  }

  export type GetMockTestAggregateType<T extends MockTestAggregateArgs> = {
        [P in keyof T & keyof AggregateMockTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMockTest[P]>
      : GetScalarType<T[P], AggregateMockTest[P]>
  }




  export type MockTestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MockTestWhereInput
    orderBy?: MockTestOrderByWithAggregationInput | MockTestOrderByWithAggregationInput[]
    by: MockTestScalarFieldEnum[] | MockTestScalarFieldEnum
    having?: MockTestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MockTestCountAggregateInputType | true
    _avg?: MockTestAvgAggregateInputType
    _sum?: MockTestSumAggregateInputType
    _min?: MockTestMinAggregateInputType
    _max?: MockTestMaxAggregateInputType
  }

  export type MockTestGroupByOutputType = {
    id: string
    userId: string
    programId: string
    score: number | null
    maxScore: number | null
    timeTakenMinutes: number | null
    status: string
    completedAt: Date | null
    createdAt: Date
    _count: MockTestCountAggregateOutputType | null
    _avg: MockTestAvgAggregateOutputType | null
    _sum: MockTestSumAggregateOutputType | null
    _min: MockTestMinAggregateOutputType | null
    _max: MockTestMaxAggregateOutputType | null
  }

  type GetMockTestGroupByPayload<T extends MockTestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MockTestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MockTestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MockTestGroupByOutputType[P]>
            : GetScalarType<T[P], MockTestGroupByOutputType[P]>
        }
      >
    >


  export type MockTestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programId?: boolean
    score?: boolean
    maxScore?: boolean
    timeTakenMinutes?: boolean
    status?: boolean
    completedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mockTest"]>

  export type MockTestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programId?: boolean
    score?: boolean
    maxScore?: boolean
    timeTakenMinutes?: boolean
    status?: boolean
    completedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mockTest"]>

  export type MockTestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programId?: boolean
    score?: boolean
    maxScore?: boolean
    timeTakenMinutes?: boolean
    status?: boolean
    completedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mockTest"]>

  export type MockTestSelectScalar = {
    id?: boolean
    userId?: boolean
    programId?: boolean
    score?: boolean
    maxScore?: boolean
    timeTakenMinutes?: boolean
    status?: boolean
    completedAt?: boolean
    createdAt?: boolean
  }

  export type MockTestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "programId" | "score" | "maxScore" | "timeTakenMinutes" | "status" | "completedAt" | "createdAt", ExtArgs["result"]["mockTest"]>
  export type MockTestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }
  export type MockTestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }
  export type MockTestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    program?: boolean | ProgramDefaultArgs<ExtArgs>
  }

  export type $MockTestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MockTest"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      program: Prisma.$ProgramPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      programId: string
      score: number | null
      maxScore: number | null
      timeTakenMinutes: number | null
      status: string
      completedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["mockTest"]>
    composites: {}
  }

  type MockTestGetPayload<S extends boolean | null | undefined | MockTestDefaultArgs> = $Result.GetResult<Prisma.$MockTestPayload, S>

  type MockTestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MockTestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MockTestCountAggregateInputType | true
    }

  export interface MockTestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MockTest'], meta: { name: 'MockTest' } }
    /**
     * Find zero or one MockTest that matches the filter.
     * @param {MockTestFindUniqueArgs} args - Arguments to find a MockTest
     * @example
     * // Get one MockTest
     * const mockTest = await prisma.mockTest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MockTestFindUniqueArgs>(args: SelectSubset<T, MockTestFindUniqueArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MockTest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MockTestFindUniqueOrThrowArgs} args - Arguments to find a MockTest
     * @example
     * // Get one MockTest
     * const mockTest = await prisma.mockTest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MockTestFindUniqueOrThrowArgs>(args: SelectSubset<T, MockTestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MockTest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockTestFindFirstArgs} args - Arguments to find a MockTest
     * @example
     * // Get one MockTest
     * const mockTest = await prisma.mockTest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MockTestFindFirstArgs>(args?: SelectSubset<T, MockTestFindFirstArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MockTest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockTestFindFirstOrThrowArgs} args - Arguments to find a MockTest
     * @example
     * // Get one MockTest
     * const mockTest = await prisma.mockTest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MockTestFindFirstOrThrowArgs>(args?: SelectSubset<T, MockTestFindFirstOrThrowArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MockTests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockTestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MockTests
     * const mockTests = await prisma.mockTest.findMany()
     * 
     * // Get first 10 MockTests
     * const mockTests = await prisma.mockTest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mockTestWithIdOnly = await prisma.mockTest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MockTestFindManyArgs>(args?: SelectSubset<T, MockTestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MockTest.
     * @param {MockTestCreateArgs} args - Arguments to create a MockTest.
     * @example
     * // Create one MockTest
     * const MockTest = await prisma.mockTest.create({
     *   data: {
     *     // ... data to create a MockTest
     *   }
     * })
     * 
     */
    create<T extends MockTestCreateArgs>(args: SelectSubset<T, MockTestCreateArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MockTests.
     * @param {MockTestCreateManyArgs} args - Arguments to create many MockTests.
     * @example
     * // Create many MockTests
     * const mockTest = await prisma.mockTest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MockTestCreateManyArgs>(args?: SelectSubset<T, MockTestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MockTests and returns the data saved in the database.
     * @param {MockTestCreateManyAndReturnArgs} args - Arguments to create many MockTests.
     * @example
     * // Create many MockTests
     * const mockTest = await prisma.mockTest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MockTests and only return the `id`
     * const mockTestWithIdOnly = await prisma.mockTest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MockTestCreateManyAndReturnArgs>(args?: SelectSubset<T, MockTestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MockTest.
     * @param {MockTestDeleteArgs} args - Arguments to delete one MockTest.
     * @example
     * // Delete one MockTest
     * const MockTest = await prisma.mockTest.delete({
     *   where: {
     *     // ... filter to delete one MockTest
     *   }
     * })
     * 
     */
    delete<T extends MockTestDeleteArgs>(args: SelectSubset<T, MockTestDeleteArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MockTest.
     * @param {MockTestUpdateArgs} args - Arguments to update one MockTest.
     * @example
     * // Update one MockTest
     * const mockTest = await prisma.mockTest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MockTestUpdateArgs>(args: SelectSubset<T, MockTestUpdateArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MockTests.
     * @param {MockTestDeleteManyArgs} args - Arguments to filter MockTests to delete.
     * @example
     * // Delete a few MockTests
     * const { count } = await prisma.mockTest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MockTestDeleteManyArgs>(args?: SelectSubset<T, MockTestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MockTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockTestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MockTests
     * const mockTest = await prisma.mockTest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MockTestUpdateManyArgs>(args: SelectSubset<T, MockTestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MockTests and returns the data updated in the database.
     * @param {MockTestUpdateManyAndReturnArgs} args - Arguments to update many MockTests.
     * @example
     * // Update many MockTests
     * const mockTest = await prisma.mockTest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MockTests and only return the `id`
     * const mockTestWithIdOnly = await prisma.mockTest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MockTestUpdateManyAndReturnArgs>(args: SelectSubset<T, MockTestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MockTest.
     * @param {MockTestUpsertArgs} args - Arguments to update or create a MockTest.
     * @example
     * // Update or create a MockTest
     * const mockTest = await prisma.mockTest.upsert({
     *   create: {
     *     // ... data to create a MockTest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MockTest we want to update
     *   }
     * })
     */
    upsert<T extends MockTestUpsertArgs>(args: SelectSubset<T, MockTestUpsertArgs<ExtArgs>>): Prisma__MockTestClient<$Result.GetResult<Prisma.$MockTestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MockTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockTestCountArgs} args - Arguments to filter MockTests to count.
     * @example
     * // Count the number of MockTests
     * const count = await prisma.mockTest.count({
     *   where: {
     *     // ... the filter for the MockTests we want to count
     *   }
     * })
    **/
    count<T extends MockTestCountArgs>(
      args?: Subset<T, MockTestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MockTestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MockTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockTestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MockTestAggregateArgs>(args: Subset<T, MockTestAggregateArgs>): Prisma.PrismaPromise<GetMockTestAggregateType<T>>

    /**
     * Group by MockTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MockTestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MockTestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MockTestGroupByArgs['orderBy'] }
        : { orderBy?: MockTestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MockTestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMockTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MockTest model
   */
  readonly fields: MockTestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MockTest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MockTestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    program<T extends ProgramDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramDefaultArgs<ExtArgs>>): Prisma__ProgramClient<$Result.GetResult<Prisma.$ProgramPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MockTest model
   */
  interface MockTestFieldRefs {
    readonly id: FieldRef<"MockTest", 'String'>
    readonly userId: FieldRef<"MockTest", 'String'>
    readonly programId: FieldRef<"MockTest", 'String'>
    readonly score: FieldRef<"MockTest", 'Int'>
    readonly maxScore: FieldRef<"MockTest", 'Int'>
    readonly timeTakenMinutes: FieldRef<"MockTest", 'Int'>
    readonly status: FieldRef<"MockTest", 'String'>
    readonly completedAt: FieldRef<"MockTest", 'DateTime'>
    readonly createdAt: FieldRef<"MockTest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MockTest findUnique
   */
  export type MockTestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * Filter, which MockTest to fetch.
     */
    where: MockTestWhereUniqueInput
  }

  /**
   * MockTest findUniqueOrThrow
   */
  export type MockTestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * Filter, which MockTest to fetch.
     */
    where: MockTestWhereUniqueInput
  }

  /**
   * MockTest findFirst
   */
  export type MockTestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * Filter, which MockTest to fetch.
     */
    where?: MockTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockTests to fetch.
     */
    orderBy?: MockTestOrderByWithRelationInput | MockTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MockTests.
     */
    cursor?: MockTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MockTests.
     */
    distinct?: MockTestScalarFieldEnum | MockTestScalarFieldEnum[]
  }

  /**
   * MockTest findFirstOrThrow
   */
  export type MockTestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * Filter, which MockTest to fetch.
     */
    where?: MockTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockTests to fetch.
     */
    orderBy?: MockTestOrderByWithRelationInput | MockTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MockTests.
     */
    cursor?: MockTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MockTests.
     */
    distinct?: MockTestScalarFieldEnum | MockTestScalarFieldEnum[]
  }

  /**
   * MockTest findMany
   */
  export type MockTestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * Filter, which MockTests to fetch.
     */
    where?: MockTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MockTests to fetch.
     */
    orderBy?: MockTestOrderByWithRelationInput | MockTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MockTests.
     */
    cursor?: MockTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MockTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MockTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MockTests.
     */
    distinct?: MockTestScalarFieldEnum | MockTestScalarFieldEnum[]
  }

  /**
   * MockTest create
   */
  export type MockTestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * The data needed to create a MockTest.
     */
    data: XOR<MockTestCreateInput, MockTestUncheckedCreateInput>
  }

  /**
   * MockTest createMany
   */
  export type MockTestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MockTests.
     */
    data: MockTestCreateManyInput | MockTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MockTest createManyAndReturn
   */
  export type MockTestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * The data used to create many MockTests.
     */
    data: MockTestCreateManyInput | MockTestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MockTest update
   */
  export type MockTestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * The data needed to update a MockTest.
     */
    data: XOR<MockTestUpdateInput, MockTestUncheckedUpdateInput>
    /**
     * Choose, which MockTest to update.
     */
    where: MockTestWhereUniqueInput
  }

  /**
   * MockTest updateMany
   */
  export type MockTestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MockTests.
     */
    data: XOR<MockTestUpdateManyMutationInput, MockTestUncheckedUpdateManyInput>
    /**
     * Filter which MockTests to update
     */
    where?: MockTestWhereInput
    /**
     * Limit how many MockTests to update.
     */
    limit?: number
  }

  /**
   * MockTest updateManyAndReturn
   */
  export type MockTestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * The data used to update MockTests.
     */
    data: XOR<MockTestUpdateManyMutationInput, MockTestUncheckedUpdateManyInput>
    /**
     * Filter which MockTests to update
     */
    where?: MockTestWhereInput
    /**
     * Limit how many MockTests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MockTest upsert
   */
  export type MockTestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * The filter to search for the MockTest to update in case it exists.
     */
    where: MockTestWhereUniqueInput
    /**
     * In case the MockTest found by the `where` argument doesn't exist, create a new MockTest with this data.
     */
    create: XOR<MockTestCreateInput, MockTestUncheckedCreateInput>
    /**
     * In case the MockTest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MockTestUpdateInput, MockTestUncheckedUpdateInput>
  }

  /**
   * MockTest delete
   */
  export type MockTestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
    /**
     * Filter which MockTest to delete.
     */
    where: MockTestWhereUniqueInput
  }

  /**
   * MockTest deleteMany
   */
  export type MockTestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MockTests to delete
     */
    where?: MockTestWhereInput
    /**
     * Limit how many MockTests to delete.
     */
    limit?: number
  }

  /**
   * MockTest without action
   */
  export type MockTestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MockTest
     */
    select?: MockTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MockTest
     */
    omit?: MockTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MockTestInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UniversityScalarFieldEnum: {
    id: 'id',
    oid: 'oid',
    name: 'name',
    description: 'description',
    logoUrl: 'logoUrl',
    type: 'type',
    municipality: 'municipality',
    website: 'website',
    email: 'email',
    studentCount: 'studentCount',
    syncedAt: 'syncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UniversityScalarFieldEnum = (typeof UniversityScalarFieldEnum)[keyof typeof UniversityScalarFieldEnum]


  export const UniversityLocationScalarFieldEnum: {
    id: 'id',
    universityId: 'universityId',
    code: 'code',
    name: 'name'
  };

  export type UniversityLocationScalarFieldEnum = (typeof UniversityLocationScalarFieldEnum)[keyof typeof UniversityLocationScalarFieldEnum]


  export const ProgramScalarFieldEnum: {
    id: 'id',
    oid: 'oid',
    name: 'name',
    description: 'description',
    type: 'type',
    typePath: 'typePath',
    isDegree: 'isDegree',
    imageUrl: 'imageUrl',
    creditsAmount: 'creditsAmount',
    creditsUnit: 'creditsUnit',
    eqfLevel: 'eqfLevel',
    nqfLevel: 'nqfLevel',
    fieldOfStudy: 'fieldOfStudy',
    degreeTitles: 'degreeTitles',
    implementations: 'implementations',
    syncedAt: 'syncedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProgramScalarFieldEnum = (typeof ProgramScalarFieldEnum)[keyof typeof ProgramScalarFieldEnum]


  export const ProgramUniversityScalarFieldEnum: {
    programId: 'programId',
    universityId: 'universityId'
  };

  export type ProgramUniversityScalarFieldEnum = (typeof ProgramUniversityScalarFieldEnum)[keyof typeof ProgramUniversityScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    emailVerifiedAt: 'emailVerifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AuthScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    refreshToken: 'refreshToken',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type AuthScalarFieldEnum = (typeof AuthScalarFieldEnum)[keyof typeof AuthScalarFieldEnum]


  export const UserProgramScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    programId: 'programId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type UserProgramScalarFieldEnum = (typeof UserProgramScalarFieldEnum)[keyof typeof UserProgramScalarFieldEnum]


  export const UserUniversityScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    universityId: 'universityId',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type UserUniversityScalarFieldEnum = (typeof UserUniversityScalarFieldEnum)[keyof typeof UserUniversityScalarFieldEnum]


  export const MockTestScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    programId: 'programId',
    score: 'score',
    maxScore: 'maxScore',
    timeTakenMinutes: 'timeTakenMinutes',
    status: 'status',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
  };

  export type MockTestScalarFieldEnum = (typeof MockTestScalarFieldEnum)[keyof typeof MockTestScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type UniversityWhereInput = {
    AND?: UniversityWhereInput | UniversityWhereInput[]
    OR?: UniversityWhereInput[]
    NOT?: UniversityWhereInput | UniversityWhereInput[]
    id?: StringFilter<"University"> | string
    oid?: StringFilter<"University"> | string
    name?: StringFilter<"University"> | string
    description?: StringNullableFilter<"University"> | string | null
    logoUrl?: StringNullableFilter<"University"> | string | null
    type?: StringFilter<"University"> | string
    municipality?: StringNullableFilter<"University"> | string | null
    website?: StringNullableFilter<"University"> | string | null
    email?: StringNullableFilter<"University"> | string | null
    studentCount?: IntNullableFilter<"University"> | number | null
    syncedAt?: DateTimeFilter<"University"> | Date | string
    createdAt?: DateTimeFilter<"University"> | Date | string
    updatedAt?: DateTimeFilter<"University"> | Date | string
    programs?: ProgramUniversityListRelationFilter
    locations?: UniversityLocationListRelationFilter
    usersSaved?: UserUniversityListRelationFilter
  }

  export type UniversityOrderByWithRelationInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    type?: SortOrder
    municipality?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    studentCount?: SortOrderInput | SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    programs?: ProgramUniversityOrderByRelationAggregateInput
    locations?: UniversityLocationOrderByRelationAggregateInput
    usersSaved?: UserUniversityOrderByRelationAggregateInput
  }

  export type UniversityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    oid?: string
    AND?: UniversityWhereInput | UniversityWhereInput[]
    OR?: UniversityWhereInput[]
    NOT?: UniversityWhereInput | UniversityWhereInput[]
    name?: StringFilter<"University"> | string
    description?: StringNullableFilter<"University"> | string | null
    logoUrl?: StringNullableFilter<"University"> | string | null
    type?: StringFilter<"University"> | string
    municipality?: StringNullableFilter<"University"> | string | null
    website?: StringNullableFilter<"University"> | string | null
    email?: StringNullableFilter<"University"> | string | null
    studentCount?: IntNullableFilter<"University"> | number | null
    syncedAt?: DateTimeFilter<"University"> | Date | string
    createdAt?: DateTimeFilter<"University"> | Date | string
    updatedAt?: DateTimeFilter<"University"> | Date | string
    programs?: ProgramUniversityListRelationFilter
    locations?: UniversityLocationListRelationFilter
    usersSaved?: UserUniversityListRelationFilter
  }, "id" | "oid">

  export type UniversityOrderByWithAggregationInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    type?: SortOrder
    municipality?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    studentCount?: SortOrderInput | SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UniversityCountOrderByAggregateInput
    _avg?: UniversityAvgOrderByAggregateInput
    _max?: UniversityMaxOrderByAggregateInput
    _min?: UniversityMinOrderByAggregateInput
    _sum?: UniversitySumOrderByAggregateInput
  }

  export type UniversityScalarWhereWithAggregatesInput = {
    AND?: UniversityScalarWhereWithAggregatesInput | UniversityScalarWhereWithAggregatesInput[]
    OR?: UniversityScalarWhereWithAggregatesInput[]
    NOT?: UniversityScalarWhereWithAggregatesInput | UniversityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"University"> | string
    oid?: StringWithAggregatesFilter<"University"> | string
    name?: StringWithAggregatesFilter<"University"> | string
    description?: StringNullableWithAggregatesFilter<"University"> | string | null
    logoUrl?: StringNullableWithAggregatesFilter<"University"> | string | null
    type?: StringWithAggregatesFilter<"University"> | string
    municipality?: StringNullableWithAggregatesFilter<"University"> | string | null
    website?: StringNullableWithAggregatesFilter<"University"> | string | null
    email?: StringNullableWithAggregatesFilter<"University"> | string | null
    studentCount?: IntNullableWithAggregatesFilter<"University"> | number | null
    syncedAt?: DateTimeWithAggregatesFilter<"University"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"University"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"University"> | Date | string
  }

  export type UniversityLocationWhereInput = {
    AND?: UniversityLocationWhereInput | UniversityLocationWhereInput[]
    OR?: UniversityLocationWhereInput[]
    NOT?: UniversityLocationWhereInput | UniversityLocationWhereInput[]
    id?: StringFilter<"UniversityLocation"> | string
    universityId?: StringFilter<"UniversityLocation"> | string
    code?: StringFilter<"UniversityLocation"> | string
    name?: StringFilter<"UniversityLocation"> | string
    university?: XOR<UniversityScalarRelationFilter, UniversityWhereInput>
  }

  export type UniversityLocationOrderByWithRelationInput = {
    id?: SortOrder
    universityId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    university?: UniversityOrderByWithRelationInput
  }

  export type UniversityLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    universityId_code?: UniversityLocationUniversityIdCodeCompoundUniqueInput
    AND?: UniversityLocationWhereInput | UniversityLocationWhereInput[]
    OR?: UniversityLocationWhereInput[]
    NOT?: UniversityLocationWhereInput | UniversityLocationWhereInput[]
    universityId?: StringFilter<"UniversityLocation"> | string
    code?: StringFilter<"UniversityLocation"> | string
    name?: StringFilter<"UniversityLocation"> | string
    university?: XOR<UniversityScalarRelationFilter, UniversityWhereInput>
  }, "id" | "universityId_code">

  export type UniversityLocationOrderByWithAggregationInput = {
    id?: SortOrder
    universityId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    _count?: UniversityLocationCountOrderByAggregateInput
    _max?: UniversityLocationMaxOrderByAggregateInput
    _min?: UniversityLocationMinOrderByAggregateInput
  }

  export type UniversityLocationScalarWhereWithAggregatesInput = {
    AND?: UniversityLocationScalarWhereWithAggregatesInput | UniversityLocationScalarWhereWithAggregatesInput[]
    OR?: UniversityLocationScalarWhereWithAggregatesInput[]
    NOT?: UniversityLocationScalarWhereWithAggregatesInput | UniversityLocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UniversityLocation"> | string
    universityId?: StringWithAggregatesFilter<"UniversityLocation"> | string
    code?: StringWithAggregatesFilter<"UniversityLocation"> | string
    name?: StringWithAggregatesFilter<"UniversityLocation"> | string
  }

  export type ProgramWhereInput = {
    AND?: ProgramWhereInput | ProgramWhereInput[]
    OR?: ProgramWhereInput[]
    NOT?: ProgramWhereInput | ProgramWhereInput[]
    id?: StringFilter<"Program"> | string
    oid?: StringFilter<"Program"> | string
    name?: StringFilter<"Program"> | string
    description?: StringNullableFilter<"Program"> | string | null
    type?: StringFilter<"Program"> | string
    typePath?: StringNullableFilter<"Program"> | string | null
    isDegree?: BoolFilter<"Program"> | boolean
    imageUrl?: StringNullableFilter<"Program"> | string | null
    creditsAmount?: FloatNullableFilter<"Program"> | number | null
    creditsUnit?: StringNullableFilter<"Program"> | string | null
    eqfLevel?: StringNullableFilter<"Program"> | string | null
    nqfLevel?: StringNullableFilter<"Program"> | string | null
    fieldOfStudy?: StringNullableFilter<"Program"> | string | null
    degreeTitles?: StringNullableListFilter<"Program">
    implementations?: JsonNullableFilter<"Program">
    syncedAt?: DateTimeFilter<"Program"> | Date | string
    createdAt?: DateTimeFilter<"Program"> | Date | string
    updatedAt?: DateTimeFilter<"Program"> | Date | string
    universities?: ProgramUniversityListRelationFilter
    userPrograms?: UserProgramListRelationFilter
    mockTests?: MockTestListRelationFilter
  }

  export type ProgramOrderByWithRelationInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    typePath?: SortOrderInput | SortOrder
    isDegree?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    creditsAmount?: SortOrderInput | SortOrder
    creditsUnit?: SortOrderInput | SortOrder
    eqfLevel?: SortOrderInput | SortOrder
    nqfLevel?: SortOrderInput | SortOrder
    fieldOfStudy?: SortOrderInput | SortOrder
    degreeTitles?: SortOrder
    implementations?: SortOrderInput | SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    universities?: ProgramUniversityOrderByRelationAggregateInput
    userPrograms?: UserProgramOrderByRelationAggregateInput
    mockTests?: MockTestOrderByRelationAggregateInput
  }

  export type ProgramWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    oid?: string
    AND?: ProgramWhereInput | ProgramWhereInput[]
    OR?: ProgramWhereInput[]
    NOT?: ProgramWhereInput | ProgramWhereInput[]
    name?: StringFilter<"Program"> | string
    description?: StringNullableFilter<"Program"> | string | null
    type?: StringFilter<"Program"> | string
    typePath?: StringNullableFilter<"Program"> | string | null
    isDegree?: BoolFilter<"Program"> | boolean
    imageUrl?: StringNullableFilter<"Program"> | string | null
    creditsAmount?: FloatNullableFilter<"Program"> | number | null
    creditsUnit?: StringNullableFilter<"Program"> | string | null
    eqfLevel?: StringNullableFilter<"Program"> | string | null
    nqfLevel?: StringNullableFilter<"Program"> | string | null
    fieldOfStudy?: StringNullableFilter<"Program"> | string | null
    degreeTitles?: StringNullableListFilter<"Program">
    implementations?: JsonNullableFilter<"Program">
    syncedAt?: DateTimeFilter<"Program"> | Date | string
    createdAt?: DateTimeFilter<"Program"> | Date | string
    updatedAt?: DateTimeFilter<"Program"> | Date | string
    universities?: ProgramUniversityListRelationFilter
    userPrograms?: UserProgramListRelationFilter
    mockTests?: MockTestListRelationFilter
  }, "id" | "oid">

  export type ProgramOrderByWithAggregationInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    typePath?: SortOrderInput | SortOrder
    isDegree?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    creditsAmount?: SortOrderInput | SortOrder
    creditsUnit?: SortOrderInput | SortOrder
    eqfLevel?: SortOrderInput | SortOrder
    nqfLevel?: SortOrderInput | SortOrder
    fieldOfStudy?: SortOrderInput | SortOrder
    degreeTitles?: SortOrder
    implementations?: SortOrderInput | SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProgramCountOrderByAggregateInput
    _avg?: ProgramAvgOrderByAggregateInput
    _max?: ProgramMaxOrderByAggregateInput
    _min?: ProgramMinOrderByAggregateInput
    _sum?: ProgramSumOrderByAggregateInput
  }

  export type ProgramScalarWhereWithAggregatesInput = {
    AND?: ProgramScalarWhereWithAggregatesInput | ProgramScalarWhereWithAggregatesInput[]
    OR?: ProgramScalarWhereWithAggregatesInput[]
    NOT?: ProgramScalarWhereWithAggregatesInput | ProgramScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Program"> | string
    oid?: StringWithAggregatesFilter<"Program"> | string
    name?: StringWithAggregatesFilter<"Program"> | string
    description?: StringNullableWithAggregatesFilter<"Program"> | string | null
    type?: StringWithAggregatesFilter<"Program"> | string
    typePath?: StringNullableWithAggregatesFilter<"Program"> | string | null
    isDegree?: BoolWithAggregatesFilter<"Program"> | boolean
    imageUrl?: StringNullableWithAggregatesFilter<"Program"> | string | null
    creditsAmount?: FloatNullableWithAggregatesFilter<"Program"> | number | null
    creditsUnit?: StringNullableWithAggregatesFilter<"Program"> | string | null
    eqfLevel?: StringNullableWithAggregatesFilter<"Program"> | string | null
    nqfLevel?: StringNullableWithAggregatesFilter<"Program"> | string | null
    fieldOfStudy?: StringNullableWithAggregatesFilter<"Program"> | string | null
    degreeTitles?: StringNullableListFilter<"Program">
    implementations?: JsonNullableWithAggregatesFilter<"Program">
    syncedAt?: DateTimeWithAggregatesFilter<"Program"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Program"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Program"> | Date | string
  }

  export type ProgramUniversityWhereInput = {
    AND?: ProgramUniversityWhereInput | ProgramUniversityWhereInput[]
    OR?: ProgramUniversityWhereInput[]
    NOT?: ProgramUniversityWhereInput | ProgramUniversityWhereInput[]
    programId?: StringFilter<"ProgramUniversity"> | string
    universityId?: StringFilter<"ProgramUniversity"> | string
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
    university?: XOR<UniversityScalarRelationFilter, UniversityWhereInput>
  }

  export type ProgramUniversityOrderByWithRelationInput = {
    programId?: SortOrder
    universityId?: SortOrder
    program?: ProgramOrderByWithRelationInput
    university?: UniversityOrderByWithRelationInput
  }

  export type ProgramUniversityWhereUniqueInput = Prisma.AtLeast<{
    programId_universityId?: ProgramUniversityProgramIdUniversityIdCompoundUniqueInput
    AND?: ProgramUniversityWhereInput | ProgramUniversityWhereInput[]
    OR?: ProgramUniversityWhereInput[]
    NOT?: ProgramUniversityWhereInput | ProgramUniversityWhereInput[]
    programId?: StringFilter<"ProgramUniversity"> | string
    universityId?: StringFilter<"ProgramUniversity"> | string
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
    university?: XOR<UniversityScalarRelationFilter, UniversityWhereInput>
  }, "programId_universityId">

  export type ProgramUniversityOrderByWithAggregationInput = {
    programId?: SortOrder
    universityId?: SortOrder
    _count?: ProgramUniversityCountOrderByAggregateInput
    _max?: ProgramUniversityMaxOrderByAggregateInput
    _min?: ProgramUniversityMinOrderByAggregateInput
  }

  export type ProgramUniversityScalarWhereWithAggregatesInput = {
    AND?: ProgramUniversityScalarWhereWithAggregatesInput | ProgramUniversityScalarWhereWithAggregatesInput[]
    OR?: ProgramUniversityScalarWhereWithAggregatesInput[]
    NOT?: ProgramUniversityScalarWhereWithAggregatesInput | ProgramUniversityScalarWhereWithAggregatesInput[]
    programId?: StringWithAggregatesFilter<"ProgramUniversity"> | string
    universityId?: StringWithAggregatesFilter<"ProgramUniversity"> | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    auth?: XOR<AuthNullableScalarRelationFilter, AuthWhereInput> | null
    mockTests?: MockTestListRelationFilter
    savedPrograms?: UserProgramListRelationFilter
    savedUniversities?: UserUniversityListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    auth?: AuthOrderByWithRelationInput
    mockTests?: MockTestOrderByRelationAggregateInput
    savedPrograms?: UserProgramOrderByRelationAggregateInput
    savedUniversities?: UserUniversityOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    auth?: XOR<AuthNullableScalarRelationFilter, AuthWhereInput> | null
    mockTests?: MockTestListRelationFilter
    savedPrograms?: UserProgramListRelationFilter
    savedUniversities?: UserUniversityListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AuthWhereInput = {
    AND?: AuthWhereInput | AuthWhereInput[]
    OR?: AuthWhereInput[]
    NOT?: AuthWhereInput | AuthWhereInput[]
    id?: StringFilter<"Auth"> | string
    userId?: StringFilter<"Auth"> | string
    refreshToken?: StringFilter<"Auth"> | string
    createdAt?: DateTimeFilter<"Auth"> | Date | string
    expiresAt?: DateTimeFilter<"Auth"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuthOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuthWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: AuthWhereInput | AuthWhereInput[]
    OR?: AuthWhereInput[]
    NOT?: AuthWhereInput | AuthWhereInput[]
    refreshToken?: StringFilter<"Auth"> | string
    createdAt?: DateTimeFilter<"Auth"> | Date | string
    expiresAt?: DateTimeFilter<"Auth"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type AuthOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: AuthCountOrderByAggregateInput
    _max?: AuthMaxOrderByAggregateInput
    _min?: AuthMinOrderByAggregateInput
  }

  export type AuthScalarWhereWithAggregatesInput = {
    AND?: AuthScalarWhereWithAggregatesInput | AuthScalarWhereWithAggregatesInput[]
    OR?: AuthScalarWhereWithAggregatesInput[]
    NOT?: AuthScalarWhereWithAggregatesInput | AuthScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Auth"> | string
    userId?: StringWithAggregatesFilter<"Auth"> | string
    refreshToken?: StringWithAggregatesFilter<"Auth"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Auth"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"Auth"> | Date | string
  }

  export type UserProgramWhereInput = {
    AND?: UserProgramWhereInput | UserProgramWhereInput[]
    OR?: UserProgramWhereInput[]
    NOT?: UserProgramWhereInput | UserProgramWhereInput[]
    id?: StringFilter<"UserProgram"> | string
    userId?: StringFilter<"UserProgram"> | string
    programId?: StringFilter<"UserProgram"> | string
    status?: StringNullableFilter<"UserProgram"> | string | null
    createdAt?: DateTimeFilter<"UserProgram"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
  }

  export type UserProgramOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    status?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    program?: ProgramOrderByWithRelationInput
  }

  export type UserProgramWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_programId?: UserProgramUserIdProgramIdCompoundUniqueInput
    AND?: UserProgramWhereInput | UserProgramWhereInput[]
    OR?: UserProgramWhereInput[]
    NOT?: UserProgramWhereInput | UserProgramWhereInput[]
    userId?: StringFilter<"UserProgram"> | string
    programId?: StringFilter<"UserProgram"> | string
    status?: StringNullableFilter<"UserProgram"> | string | null
    createdAt?: DateTimeFilter<"UserProgram"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
  }, "id" | "userId_programId">

  export type UserProgramOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    status?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserProgramCountOrderByAggregateInput
    _max?: UserProgramMaxOrderByAggregateInput
    _min?: UserProgramMinOrderByAggregateInput
  }

  export type UserProgramScalarWhereWithAggregatesInput = {
    AND?: UserProgramScalarWhereWithAggregatesInput | UserProgramScalarWhereWithAggregatesInput[]
    OR?: UserProgramScalarWhereWithAggregatesInput[]
    NOT?: UserProgramScalarWhereWithAggregatesInput | UserProgramScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProgram"> | string
    userId?: StringWithAggregatesFilter<"UserProgram"> | string
    programId?: StringWithAggregatesFilter<"UserProgram"> | string
    status?: StringNullableWithAggregatesFilter<"UserProgram"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserProgram"> | Date | string
  }

  export type UserUniversityWhereInput = {
    AND?: UserUniversityWhereInput | UserUniversityWhereInput[]
    OR?: UserUniversityWhereInput[]
    NOT?: UserUniversityWhereInput | UserUniversityWhereInput[]
    id?: StringFilter<"UserUniversity"> | string
    userId?: StringFilter<"UserUniversity"> | string
    universityId?: StringFilter<"UserUniversity"> | string
    notes?: StringNullableFilter<"UserUniversity"> | string | null
    createdAt?: DateTimeFilter<"UserUniversity"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    university?: XOR<UniversityScalarRelationFilter, UniversityWhereInput>
  }

  export type UserUniversityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    universityId?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    university?: UniversityOrderByWithRelationInput
  }

  export type UserUniversityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_universityId?: UserUniversityUserIdUniversityIdCompoundUniqueInput
    AND?: UserUniversityWhereInput | UserUniversityWhereInput[]
    OR?: UserUniversityWhereInput[]
    NOT?: UserUniversityWhereInput | UserUniversityWhereInput[]
    userId?: StringFilter<"UserUniversity"> | string
    universityId?: StringFilter<"UserUniversity"> | string
    notes?: StringNullableFilter<"UserUniversity"> | string | null
    createdAt?: DateTimeFilter<"UserUniversity"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    university?: XOR<UniversityScalarRelationFilter, UniversityWhereInput>
  }, "id" | "userId_universityId">

  export type UserUniversityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    universityId?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserUniversityCountOrderByAggregateInput
    _max?: UserUniversityMaxOrderByAggregateInput
    _min?: UserUniversityMinOrderByAggregateInput
  }

  export type UserUniversityScalarWhereWithAggregatesInput = {
    AND?: UserUniversityScalarWhereWithAggregatesInput | UserUniversityScalarWhereWithAggregatesInput[]
    OR?: UserUniversityScalarWhereWithAggregatesInput[]
    NOT?: UserUniversityScalarWhereWithAggregatesInput | UserUniversityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserUniversity"> | string
    userId?: StringWithAggregatesFilter<"UserUniversity"> | string
    universityId?: StringWithAggregatesFilter<"UserUniversity"> | string
    notes?: StringNullableWithAggregatesFilter<"UserUniversity"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserUniversity"> | Date | string
  }

  export type MockTestWhereInput = {
    AND?: MockTestWhereInput | MockTestWhereInput[]
    OR?: MockTestWhereInput[]
    NOT?: MockTestWhereInput | MockTestWhereInput[]
    id?: StringFilter<"MockTest"> | string
    userId?: StringFilter<"MockTest"> | string
    programId?: StringFilter<"MockTest"> | string
    score?: IntNullableFilter<"MockTest"> | number | null
    maxScore?: IntNullableFilter<"MockTest"> | number | null
    timeTakenMinutes?: IntNullableFilter<"MockTest"> | number | null
    status?: StringFilter<"MockTest"> | string
    completedAt?: DateTimeNullableFilter<"MockTest"> | Date | string | null
    createdAt?: DateTimeFilter<"MockTest"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
  }

  export type MockTestOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    score?: SortOrderInput | SortOrder
    maxScore?: SortOrderInput | SortOrder
    timeTakenMinutes?: SortOrderInput | SortOrder
    status?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    program?: ProgramOrderByWithRelationInput
  }

  export type MockTestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MockTestWhereInput | MockTestWhereInput[]
    OR?: MockTestWhereInput[]
    NOT?: MockTestWhereInput | MockTestWhereInput[]
    userId?: StringFilter<"MockTest"> | string
    programId?: StringFilter<"MockTest"> | string
    score?: IntNullableFilter<"MockTest"> | number | null
    maxScore?: IntNullableFilter<"MockTest"> | number | null
    timeTakenMinutes?: IntNullableFilter<"MockTest"> | number | null
    status?: StringFilter<"MockTest"> | string
    completedAt?: DateTimeNullableFilter<"MockTest"> | Date | string | null
    createdAt?: DateTimeFilter<"MockTest"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    program?: XOR<ProgramScalarRelationFilter, ProgramWhereInput>
  }, "id">

  export type MockTestOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    score?: SortOrderInput | SortOrder
    maxScore?: SortOrderInput | SortOrder
    timeTakenMinutes?: SortOrderInput | SortOrder
    status?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MockTestCountOrderByAggregateInput
    _avg?: MockTestAvgOrderByAggregateInput
    _max?: MockTestMaxOrderByAggregateInput
    _min?: MockTestMinOrderByAggregateInput
    _sum?: MockTestSumOrderByAggregateInput
  }

  export type MockTestScalarWhereWithAggregatesInput = {
    AND?: MockTestScalarWhereWithAggregatesInput | MockTestScalarWhereWithAggregatesInput[]
    OR?: MockTestScalarWhereWithAggregatesInput[]
    NOT?: MockTestScalarWhereWithAggregatesInput | MockTestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MockTest"> | string
    userId?: StringWithAggregatesFilter<"MockTest"> | string
    programId?: StringWithAggregatesFilter<"MockTest"> | string
    score?: IntNullableWithAggregatesFilter<"MockTest"> | number | null
    maxScore?: IntNullableWithAggregatesFilter<"MockTest"> | number | null
    timeTakenMinutes?: IntNullableWithAggregatesFilter<"MockTest"> | number | null
    status?: StringWithAggregatesFilter<"MockTest"> | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"MockTest"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MockTest"> | Date | string
  }

  export type UniversityCreateInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramUniversityCreateNestedManyWithoutUniversityInput
    locations?: UniversityLocationCreateNestedManyWithoutUniversityInput
    usersSaved?: UserUniversityCreateNestedManyWithoutUniversityInput
  }

  export type UniversityUncheckedCreateInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramUniversityUncheckedCreateNestedManyWithoutUniversityInput
    locations?: UniversityLocationUncheckedCreateNestedManyWithoutUniversityInput
    usersSaved?: UserUniversityUncheckedCreateNestedManyWithoutUniversityInput
  }

  export type UniversityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUniversityUpdateManyWithoutUniversityNestedInput
    locations?: UniversityLocationUpdateManyWithoutUniversityNestedInput
    usersSaved?: UserUniversityUpdateManyWithoutUniversityNestedInput
  }

  export type UniversityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUniversityUncheckedUpdateManyWithoutUniversityNestedInput
    locations?: UniversityLocationUncheckedUpdateManyWithoutUniversityNestedInput
    usersSaved?: UserUniversityUncheckedUpdateManyWithoutUniversityNestedInput
  }

  export type UniversityCreateManyInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UniversityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UniversityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UniversityLocationCreateInput = {
    id?: string
    code: string
    name: string
    university: UniversityCreateNestedOneWithoutLocationsInput
  }

  export type UniversityLocationUncheckedCreateInput = {
    id?: string
    universityId: string
    code: string
    name: string
  }

  export type UniversityLocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    university?: UniversityUpdateOneRequiredWithoutLocationsNestedInput
  }

  export type UniversityLocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UniversityLocationCreateManyInput = {
    id?: string
    universityId: string
    code: string
    name: string
  }

  export type UniversityLocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UniversityLocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ProgramCreateInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    universities?: ProgramUniversityCreateNestedManyWithoutProgramInput
    userPrograms?: UserProgramCreateNestedManyWithoutProgramInput
    mockTests?: MockTestCreateNestedManyWithoutProgramInput
  }

  export type ProgramUncheckedCreateInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    universities?: ProgramUniversityUncheckedCreateNestedManyWithoutProgramInput
    userPrograms?: UserProgramUncheckedCreateNestedManyWithoutProgramInput
    mockTests?: MockTestUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    universities?: ProgramUniversityUpdateManyWithoutProgramNestedInput
    userPrograms?: UserProgramUpdateManyWithoutProgramNestedInput
    mockTests?: MockTestUpdateManyWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    universities?: ProgramUniversityUncheckedUpdateManyWithoutProgramNestedInput
    userPrograms?: UserProgramUncheckedUpdateManyWithoutProgramNestedInput
    mockTests?: MockTestUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type ProgramCreateManyInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramUniversityCreateInput = {
    program: ProgramCreateNestedOneWithoutUniversitiesInput
    university: UniversityCreateNestedOneWithoutProgramsInput
  }

  export type ProgramUniversityUncheckedCreateInput = {
    programId: string
    universityId: string
  }

  export type ProgramUniversityUpdateInput = {
    program?: ProgramUpdateOneRequiredWithoutUniversitiesNestedInput
    university?: UniversityUpdateOneRequiredWithoutProgramsNestedInput
  }

  export type ProgramUniversityUncheckedUpdateInput = {
    programId?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
  }

  export type ProgramUniversityCreateManyInput = {
    programId: string
    universityId: string
  }

  export type ProgramUniversityUpdateManyMutationInput = {

  }

  export type ProgramUniversityUncheckedUpdateManyInput = {
    programId?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthCreateNestedOneWithoutUserInput
    mockTests?: MockTestCreateNestedManyWithoutUserInput
    savedPrograms?: UserProgramCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthUncheckedCreateNestedOneWithoutUserInput
    mockTests?: MockTestUncheckedCreateNestedManyWithoutUserInput
    savedPrograms?: UserProgramUncheckedCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUpdateOneWithoutUserNestedInput
    mockTests?: MockTestUpdateManyWithoutUserNestedInput
    savedPrograms?: UserProgramUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUncheckedUpdateOneWithoutUserNestedInput
    mockTests?: MockTestUncheckedUpdateManyWithoutUserNestedInput
    savedPrograms?: UserProgramUncheckedUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthCreateInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string
    expiresAt: Date | string
    user: UserCreateNestedOneWithoutAuthInput
  }

  export type AuthUncheckedCreateInput = {
    id?: string
    userId: string
    refreshToken: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AuthUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAuthNestedInput
  }

  export type AuthUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthCreateManyInput = {
    id?: string
    userId: string
    refreshToken: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AuthUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgramCreateInput = {
    id?: string
    status?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSavedProgramsInput
    program: ProgramCreateNestedOneWithoutUserProgramsInput
  }

  export type UserProgramUncheckedCreateInput = {
    id?: string
    userId: string
    programId: string
    status?: string | null
    createdAt?: Date | string
  }

  export type UserProgramUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedProgramsNestedInput
    program?: ProgramUpdateOneRequiredWithoutUserProgramsNestedInput
  }

  export type UserProgramUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgramCreateManyInput = {
    id?: string
    userId: string
    programId: string
    status?: string | null
    createdAt?: Date | string
  }

  export type UserProgramUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgramUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUniversityCreateInput = {
    id?: string
    notes?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSavedUniversitiesInput
    university: UniversityCreateNestedOneWithoutUsersSavedInput
  }

  export type UserUniversityUncheckedCreateInput = {
    id?: string
    userId: string
    universityId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type UserUniversityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedUniversitiesNestedInput
    university?: UniversityUpdateOneRequiredWithoutUsersSavedNestedInput
  }

  export type UserUniversityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUniversityCreateManyInput = {
    id?: string
    userId: string
    universityId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type UserUniversityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUniversityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestCreateInput = {
    id?: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMockTestsInput
    program: ProgramCreateNestedOneWithoutMockTestsInput
  }

  export type MockTestUncheckedCreateInput = {
    id?: string
    userId: string
    programId: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MockTestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMockTestsNestedInput
    program?: ProgramUpdateOneRequiredWithoutMockTestsNestedInput
  }

  export type MockTestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestCreateManyInput = {
    id?: string
    userId: string
    programId: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MockTestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProgramUniversityListRelationFilter = {
    every?: ProgramUniversityWhereInput
    some?: ProgramUniversityWhereInput
    none?: ProgramUniversityWhereInput
  }

  export type UniversityLocationListRelationFilter = {
    every?: UniversityLocationWhereInput
    some?: UniversityLocationWhereInput
    none?: UniversityLocationWhereInput
  }

  export type UserUniversityListRelationFilter = {
    every?: UserUniversityWhereInput
    some?: UserUniversityWhereInput
    none?: UserUniversityWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProgramUniversityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UniversityLocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserUniversityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UniversityCountOrderByAggregateInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    logoUrl?: SortOrder
    type?: SortOrder
    municipality?: SortOrder
    website?: SortOrder
    email?: SortOrder
    studentCount?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UniversityAvgOrderByAggregateInput = {
    studentCount?: SortOrder
  }

  export type UniversityMaxOrderByAggregateInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    logoUrl?: SortOrder
    type?: SortOrder
    municipality?: SortOrder
    website?: SortOrder
    email?: SortOrder
    studentCount?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UniversityMinOrderByAggregateInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    logoUrl?: SortOrder
    type?: SortOrder
    municipality?: SortOrder
    website?: SortOrder
    email?: SortOrder
    studentCount?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UniversitySumOrderByAggregateInput = {
    studentCount?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UniversityScalarRelationFilter = {
    is?: UniversityWhereInput
    isNot?: UniversityWhereInput
  }

  export type UniversityLocationUniversityIdCodeCompoundUniqueInput = {
    universityId: string
    code: string
  }

  export type UniversityLocationCountOrderByAggregateInput = {
    id?: SortOrder
    universityId?: SortOrder
    code?: SortOrder
    name?: SortOrder
  }

  export type UniversityLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    universityId?: SortOrder
    code?: SortOrder
    name?: SortOrder
  }

  export type UniversityLocationMinOrderByAggregateInput = {
    id?: SortOrder
    universityId?: SortOrder
    code?: SortOrder
    name?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserProgramListRelationFilter = {
    every?: UserProgramWhereInput
    some?: UserProgramWhereInput
    none?: UserProgramWhereInput
  }

  export type MockTestListRelationFilter = {
    every?: MockTestWhereInput
    some?: MockTestWhereInput
    none?: MockTestWhereInput
  }

  export type UserProgramOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MockTestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProgramCountOrderByAggregateInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    typePath?: SortOrder
    isDegree?: SortOrder
    imageUrl?: SortOrder
    creditsAmount?: SortOrder
    creditsUnit?: SortOrder
    eqfLevel?: SortOrder
    nqfLevel?: SortOrder
    fieldOfStudy?: SortOrder
    degreeTitles?: SortOrder
    implementations?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramAvgOrderByAggregateInput = {
    creditsAmount?: SortOrder
  }

  export type ProgramMaxOrderByAggregateInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    typePath?: SortOrder
    isDegree?: SortOrder
    imageUrl?: SortOrder
    creditsAmount?: SortOrder
    creditsUnit?: SortOrder
    eqfLevel?: SortOrder
    nqfLevel?: SortOrder
    fieldOfStudy?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramMinOrderByAggregateInput = {
    id?: SortOrder
    oid?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    typePath?: SortOrder
    isDegree?: SortOrder
    imageUrl?: SortOrder
    creditsAmount?: SortOrder
    creditsUnit?: SortOrder
    eqfLevel?: SortOrder
    nqfLevel?: SortOrder
    fieldOfStudy?: SortOrder
    syncedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramSumOrderByAggregateInput = {
    creditsAmount?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ProgramScalarRelationFilter = {
    is?: ProgramWhereInput
    isNot?: ProgramWhereInput
  }

  export type ProgramUniversityProgramIdUniversityIdCompoundUniqueInput = {
    programId: string
    universityId: string
  }

  export type ProgramUniversityCountOrderByAggregateInput = {
    programId?: SortOrder
    universityId?: SortOrder
  }

  export type ProgramUniversityMaxOrderByAggregateInput = {
    programId?: SortOrder
    universityId?: SortOrder
  }

  export type ProgramUniversityMinOrderByAggregateInput = {
    programId?: SortOrder
    universityId?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AuthNullableScalarRelationFilter = {
    is?: AuthWhereInput | null
    isNot?: AuthWhereInput | null
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    emailVerifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    emailVerifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    emailVerifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AuthCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AuthMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type AuthMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UserProgramUserIdProgramIdCompoundUniqueInput = {
    userId: string
    programId: string
  }

  export type UserProgramCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserProgramMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserProgramMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserUniversityUserIdUniversityIdCompoundUniqueInput = {
    userId: string
    universityId: string
  }

  export type UserUniversityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    universityId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type UserUniversityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    universityId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type UserUniversityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    universityId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type MockTestCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    score?: SortOrder
    maxScore?: SortOrder
    timeTakenMinutes?: SortOrder
    status?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MockTestAvgOrderByAggregateInput = {
    score?: SortOrder
    maxScore?: SortOrder
    timeTakenMinutes?: SortOrder
  }

  export type MockTestMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    score?: SortOrder
    maxScore?: SortOrder
    timeTakenMinutes?: SortOrder
    status?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MockTestMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programId?: SortOrder
    score?: SortOrder
    maxScore?: SortOrder
    timeTakenMinutes?: SortOrder
    status?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MockTestSumOrderByAggregateInput = {
    score?: SortOrder
    maxScore?: SortOrder
    timeTakenMinutes?: SortOrder
  }

  export type ProgramUniversityCreateNestedManyWithoutUniversityInput = {
    create?: XOR<ProgramUniversityCreateWithoutUniversityInput, ProgramUniversityUncheckedCreateWithoutUniversityInput> | ProgramUniversityCreateWithoutUniversityInput[] | ProgramUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutUniversityInput | ProgramUniversityCreateOrConnectWithoutUniversityInput[]
    createMany?: ProgramUniversityCreateManyUniversityInputEnvelope
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
  }

  export type UniversityLocationCreateNestedManyWithoutUniversityInput = {
    create?: XOR<UniversityLocationCreateWithoutUniversityInput, UniversityLocationUncheckedCreateWithoutUniversityInput> | UniversityLocationCreateWithoutUniversityInput[] | UniversityLocationUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UniversityLocationCreateOrConnectWithoutUniversityInput | UniversityLocationCreateOrConnectWithoutUniversityInput[]
    createMany?: UniversityLocationCreateManyUniversityInputEnvelope
    connect?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
  }

  export type UserUniversityCreateNestedManyWithoutUniversityInput = {
    create?: XOR<UserUniversityCreateWithoutUniversityInput, UserUniversityUncheckedCreateWithoutUniversityInput> | UserUniversityCreateWithoutUniversityInput[] | UserUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUniversityInput | UserUniversityCreateOrConnectWithoutUniversityInput[]
    createMany?: UserUniversityCreateManyUniversityInputEnvelope
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
  }

  export type ProgramUniversityUncheckedCreateNestedManyWithoutUniversityInput = {
    create?: XOR<ProgramUniversityCreateWithoutUniversityInput, ProgramUniversityUncheckedCreateWithoutUniversityInput> | ProgramUniversityCreateWithoutUniversityInput[] | ProgramUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutUniversityInput | ProgramUniversityCreateOrConnectWithoutUniversityInput[]
    createMany?: ProgramUniversityCreateManyUniversityInputEnvelope
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
  }

  export type UniversityLocationUncheckedCreateNestedManyWithoutUniversityInput = {
    create?: XOR<UniversityLocationCreateWithoutUniversityInput, UniversityLocationUncheckedCreateWithoutUniversityInput> | UniversityLocationCreateWithoutUniversityInput[] | UniversityLocationUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UniversityLocationCreateOrConnectWithoutUniversityInput | UniversityLocationCreateOrConnectWithoutUniversityInput[]
    createMany?: UniversityLocationCreateManyUniversityInputEnvelope
    connect?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
  }

  export type UserUniversityUncheckedCreateNestedManyWithoutUniversityInput = {
    create?: XOR<UserUniversityCreateWithoutUniversityInput, UserUniversityUncheckedCreateWithoutUniversityInput> | UserUniversityCreateWithoutUniversityInput[] | UserUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUniversityInput | UserUniversityCreateOrConnectWithoutUniversityInput[]
    createMany?: UserUniversityCreateManyUniversityInputEnvelope
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProgramUniversityUpdateManyWithoutUniversityNestedInput = {
    create?: XOR<ProgramUniversityCreateWithoutUniversityInput, ProgramUniversityUncheckedCreateWithoutUniversityInput> | ProgramUniversityCreateWithoutUniversityInput[] | ProgramUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutUniversityInput | ProgramUniversityCreateOrConnectWithoutUniversityInput[]
    upsert?: ProgramUniversityUpsertWithWhereUniqueWithoutUniversityInput | ProgramUniversityUpsertWithWhereUniqueWithoutUniversityInput[]
    createMany?: ProgramUniversityCreateManyUniversityInputEnvelope
    set?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    disconnect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    delete?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    update?: ProgramUniversityUpdateWithWhereUniqueWithoutUniversityInput | ProgramUniversityUpdateWithWhereUniqueWithoutUniversityInput[]
    updateMany?: ProgramUniversityUpdateManyWithWhereWithoutUniversityInput | ProgramUniversityUpdateManyWithWhereWithoutUniversityInput[]
    deleteMany?: ProgramUniversityScalarWhereInput | ProgramUniversityScalarWhereInput[]
  }

  export type UniversityLocationUpdateManyWithoutUniversityNestedInput = {
    create?: XOR<UniversityLocationCreateWithoutUniversityInput, UniversityLocationUncheckedCreateWithoutUniversityInput> | UniversityLocationCreateWithoutUniversityInput[] | UniversityLocationUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UniversityLocationCreateOrConnectWithoutUniversityInput | UniversityLocationCreateOrConnectWithoutUniversityInput[]
    upsert?: UniversityLocationUpsertWithWhereUniqueWithoutUniversityInput | UniversityLocationUpsertWithWhereUniqueWithoutUniversityInput[]
    createMany?: UniversityLocationCreateManyUniversityInputEnvelope
    set?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    disconnect?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    delete?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    connect?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    update?: UniversityLocationUpdateWithWhereUniqueWithoutUniversityInput | UniversityLocationUpdateWithWhereUniqueWithoutUniversityInput[]
    updateMany?: UniversityLocationUpdateManyWithWhereWithoutUniversityInput | UniversityLocationUpdateManyWithWhereWithoutUniversityInput[]
    deleteMany?: UniversityLocationScalarWhereInput | UniversityLocationScalarWhereInput[]
  }

  export type UserUniversityUpdateManyWithoutUniversityNestedInput = {
    create?: XOR<UserUniversityCreateWithoutUniversityInput, UserUniversityUncheckedCreateWithoutUniversityInput> | UserUniversityCreateWithoutUniversityInput[] | UserUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUniversityInput | UserUniversityCreateOrConnectWithoutUniversityInput[]
    upsert?: UserUniversityUpsertWithWhereUniqueWithoutUniversityInput | UserUniversityUpsertWithWhereUniqueWithoutUniversityInput[]
    createMany?: UserUniversityCreateManyUniversityInputEnvelope
    set?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    disconnect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    delete?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    update?: UserUniversityUpdateWithWhereUniqueWithoutUniversityInput | UserUniversityUpdateWithWhereUniqueWithoutUniversityInput[]
    updateMany?: UserUniversityUpdateManyWithWhereWithoutUniversityInput | UserUniversityUpdateManyWithWhereWithoutUniversityInput[]
    deleteMany?: UserUniversityScalarWhereInput | UserUniversityScalarWhereInput[]
  }

  export type ProgramUniversityUncheckedUpdateManyWithoutUniversityNestedInput = {
    create?: XOR<ProgramUniversityCreateWithoutUniversityInput, ProgramUniversityUncheckedCreateWithoutUniversityInput> | ProgramUniversityCreateWithoutUniversityInput[] | ProgramUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutUniversityInput | ProgramUniversityCreateOrConnectWithoutUniversityInput[]
    upsert?: ProgramUniversityUpsertWithWhereUniqueWithoutUniversityInput | ProgramUniversityUpsertWithWhereUniqueWithoutUniversityInput[]
    createMany?: ProgramUniversityCreateManyUniversityInputEnvelope
    set?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    disconnect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    delete?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    update?: ProgramUniversityUpdateWithWhereUniqueWithoutUniversityInput | ProgramUniversityUpdateWithWhereUniqueWithoutUniversityInput[]
    updateMany?: ProgramUniversityUpdateManyWithWhereWithoutUniversityInput | ProgramUniversityUpdateManyWithWhereWithoutUniversityInput[]
    deleteMany?: ProgramUniversityScalarWhereInput | ProgramUniversityScalarWhereInput[]
  }

  export type UniversityLocationUncheckedUpdateManyWithoutUniversityNestedInput = {
    create?: XOR<UniversityLocationCreateWithoutUniversityInput, UniversityLocationUncheckedCreateWithoutUniversityInput> | UniversityLocationCreateWithoutUniversityInput[] | UniversityLocationUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UniversityLocationCreateOrConnectWithoutUniversityInput | UniversityLocationCreateOrConnectWithoutUniversityInput[]
    upsert?: UniversityLocationUpsertWithWhereUniqueWithoutUniversityInput | UniversityLocationUpsertWithWhereUniqueWithoutUniversityInput[]
    createMany?: UniversityLocationCreateManyUniversityInputEnvelope
    set?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    disconnect?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    delete?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    connect?: UniversityLocationWhereUniqueInput | UniversityLocationWhereUniqueInput[]
    update?: UniversityLocationUpdateWithWhereUniqueWithoutUniversityInput | UniversityLocationUpdateWithWhereUniqueWithoutUniversityInput[]
    updateMany?: UniversityLocationUpdateManyWithWhereWithoutUniversityInput | UniversityLocationUpdateManyWithWhereWithoutUniversityInput[]
    deleteMany?: UniversityLocationScalarWhereInput | UniversityLocationScalarWhereInput[]
  }

  export type UserUniversityUncheckedUpdateManyWithoutUniversityNestedInput = {
    create?: XOR<UserUniversityCreateWithoutUniversityInput, UserUniversityUncheckedCreateWithoutUniversityInput> | UserUniversityCreateWithoutUniversityInput[] | UserUniversityUncheckedCreateWithoutUniversityInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUniversityInput | UserUniversityCreateOrConnectWithoutUniversityInput[]
    upsert?: UserUniversityUpsertWithWhereUniqueWithoutUniversityInput | UserUniversityUpsertWithWhereUniqueWithoutUniversityInput[]
    createMany?: UserUniversityCreateManyUniversityInputEnvelope
    set?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    disconnect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    delete?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    update?: UserUniversityUpdateWithWhereUniqueWithoutUniversityInput | UserUniversityUpdateWithWhereUniqueWithoutUniversityInput[]
    updateMany?: UserUniversityUpdateManyWithWhereWithoutUniversityInput | UserUniversityUpdateManyWithWhereWithoutUniversityInput[]
    deleteMany?: UserUniversityScalarWhereInput | UserUniversityScalarWhereInput[]
  }

  export type UniversityCreateNestedOneWithoutLocationsInput = {
    create?: XOR<UniversityCreateWithoutLocationsInput, UniversityUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: UniversityCreateOrConnectWithoutLocationsInput
    connect?: UniversityWhereUniqueInput
  }

  export type UniversityUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: XOR<UniversityCreateWithoutLocationsInput, UniversityUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: UniversityCreateOrConnectWithoutLocationsInput
    upsert?: UniversityUpsertWithoutLocationsInput
    connect?: UniversityWhereUniqueInput
    update?: XOR<XOR<UniversityUpdateToOneWithWhereWithoutLocationsInput, UniversityUpdateWithoutLocationsInput>, UniversityUncheckedUpdateWithoutLocationsInput>
  }

  export type ProgramCreatedegreeTitlesInput = {
    set: string[]
  }

  export type ProgramUniversityCreateNestedManyWithoutProgramInput = {
    create?: XOR<ProgramUniversityCreateWithoutProgramInput, ProgramUniversityUncheckedCreateWithoutProgramInput> | ProgramUniversityCreateWithoutProgramInput[] | ProgramUniversityUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutProgramInput | ProgramUniversityCreateOrConnectWithoutProgramInput[]
    createMany?: ProgramUniversityCreateManyProgramInputEnvelope
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
  }

  export type UserProgramCreateNestedManyWithoutProgramInput = {
    create?: XOR<UserProgramCreateWithoutProgramInput, UserProgramUncheckedCreateWithoutProgramInput> | UserProgramCreateWithoutProgramInput[] | UserProgramUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutProgramInput | UserProgramCreateOrConnectWithoutProgramInput[]
    createMany?: UserProgramCreateManyProgramInputEnvelope
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
  }

  export type MockTestCreateNestedManyWithoutProgramInput = {
    create?: XOR<MockTestCreateWithoutProgramInput, MockTestUncheckedCreateWithoutProgramInput> | MockTestCreateWithoutProgramInput[] | MockTestUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutProgramInput | MockTestCreateOrConnectWithoutProgramInput[]
    createMany?: MockTestCreateManyProgramInputEnvelope
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
  }

  export type ProgramUniversityUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<ProgramUniversityCreateWithoutProgramInput, ProgramUniversityUncheckedCreateWithoutProgramInput> | ProgramUniversityCreateWithoutProgramInput[] | ProgramUniversityUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutProgramInput | ProgramUniversityCreateOrConnectWithoutProgramInput[]
    createMany?: ProgramUniversityCreateManyProgramInputEnvelope
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
  }

  export type UserProgramUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<UserProgramCreateWithoutProgramInput, UserProgramUncheckedCreateWithoutProgramInput> | UserProgramCreateWithoutProgramInput[] | UserProgramUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutProgramInput | UserProgramCreateOrConnectWithoutProgramInput[]
    createMany?: UserProgramCreateManyProgramInputEnvelope
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
  }

  export type MockTestUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<MockTestCreateWithoutProgramInput, MockTestUncheckedCreateWithoutProgramInput> | MockTestCreateWithoutProgramInput[] | MockTestUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutProgramInput | MockTestCreateOrConnectWithoutProgramInput[]
    createMany?: MockTestCreateManyProgramInputEnvelope
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProgramUpdatedegreeTitlesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProgramUniversityUpdateManyWithoutProgramNestedInput = {
    create?: XOR<ProgramUniversityCreateWithoutProgramInput, ProgramUniversityUncheckedCreateWithoutProgramInput> | ProgramUniversityCreateWithoutProgramInput[] | ProgramUniversityUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutProgramInput | ProgramUniversityCreateOrConnectWithoutProgramInput[]
    upsert?: ProgramUniversityUpsertWithWhereUniqueWithoutProgramInput | ProgramUniversityUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: ProgramUniversityCreateManyProgramInputEnvelope
    set?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    disconnect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    delete?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    update?: ProgramUniversityUpdateWithWhereUniqueWithoutProgramInput | ProgramUniversityUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: ProgramUniversityUpdateManyWithWhereWithoutProgramInput | ProgramUniversityUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: ProgramUniversityScalarWhereInput | ProgramUniversityScalarWhereInput[]
  }

  export type UserProgramUpdateManyWithoutProgramNestedInput = {
    create?: XOR<UserProgramCreateWithoutProgramInput, UserProgramUncheckedCreateWithoutProgramInput> | UserProgramCreateWithoutProgramInput[] | UserProgramUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutProgramInput | UserProgramCreateOrConnectWithoutProgramInput[]
    upsert?: UserProgramUpsertWithWhereUniqueWithoutProgramInput | UserProgramUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: UserProgramCreateManyProgramInputEnvelope
    set?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    disconnect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    delete?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    update?: UserProgramUpdateWithWhereUniqueWithoutProgramInput | UserProgramUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: UserProgramUpdateManyWithWhereWithoutProgramInput | UserProgramUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: UserProgramScalarWhereInput | UserProgramScalarWhereInput[]
  }

  export type MockTestUpdateManyWithoutProgramNestedInput = {
    create?: XOR<MockTestCreateWithoutProgramInput, MockTestUncheckedCreateWithoutProgramInput> | MockTestCreateWithoutProgramInput[] | MockTestUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutProgramInput | MockTestCreateOrConnectWithoutProgramInput[]
    upsert?: MockTestUpsertWithWhereUniqueWithoutProgramInput | MockTestUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: MockTestCreateManyProgramInputEnvelope
    set?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    disconnect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    delete?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    update?: MockTestUpdateWithWhereUniqueWithoutProgramInput | MockTestUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: MockTestUpdateManyWithWhereWithoutProgramInput | MockTestUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: MockTestScalarWhereInput | MockTestScalarWhereInput[]
  }

  export type ProgramUniversityUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<ProgramUniversityCreateWithoutProgramInput, ProgramUniversityUncheckedCreateWithoutProgramInput> | ProgramUniversityCreateWithoutProgramInput[] | ProgramUniversityUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: ProgramUniversityCreateOrConnectWithoutProgramInput | ProgramUniversityCreateOrConnectWithoutProgramInput[]
    upsert?: ProgramUniversityUpsertWithWhereUniqueWithoutProgramInput | ProgramUniversityUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: ProgramUniversityCreateManyProgramInputEnvelope
    set?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    disconnect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    delete?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    connect?: ProgramUniversityWhereUniqueInput | ProgramUniversityWhereUniqueInput[]
    update?: ProgramUniversityUpdateWithWhereUniqueWithoutProgramInput | ProgramUniversityUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: ProgramUniversityUpdateManyWithWhereWithoutProgramInput | ProgramUniversityUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: ProgramUniversityScalarWhereInput | ProgramUniversityScalarWhereInput[]
  }

  export type UserProgramUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<UserProgramCreateWithoutProgramInput, UserProgramUncheckedCreateWithoutProgramInput> | UserProgramCreateWithoutProgramInput[] | UserProgramUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutProgramInput | UserProgramCreateOrConnectWithoutProgramInput[]
    upsert?: UserProgramUpsertWithWhereUniqueWithoutProgramInput | UserProgramUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: UserProgramCreateManyProgramInputEnvelope
    set?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    disconnect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    delete?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    update?: UserProgramUpdateWithWhereUniqueWithoutProgramInput | UserProgramUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: UserProgramUpdateManyWithWhereWithoutProgramInput | UserProgramUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: UserProgramScalarWhereInput | UserProgramScalarWhereInput[]
  }

  export type MockTestUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<MockTestCreateWithoutProgramInput, MockTestUncheckedCreateWithoutProgramInput> | MockTestCreateWithoutProgramInput[] | MockTestUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutProgramInput | MockTestCreateOrConnectWithoutProgramInput[]
    upsert?: MockTestUpsertWithWhereUniqueWithoutProgramInput | MockTestUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: MockTestCreateManyProgramInputEnvelope
    set?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    disconnect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    delete?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    update?: MockTestUpdateWithWhereUniqueWithoutProgramInput | MockTestUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: MockTestUpdateManyWithWhereWithoutProgramInput | MockTestUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: MockTestScalarWhereInput | MockTestScalarWhereInput[]
  }

  export type ProgramCreateNestedOneWithoutUniversitiesInput = {
    create?: XOR<ProgramCreateWithoutUniversitiesInput, ProgramUncheckedCreateWithoutUniversitiesInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutUniversitiesInput
    connect?: ProgramWhereUniqueInput
  }

  export type UniversityCreateNestedOneWithoutProgramsInput = {
    create?: XOR<UniversityCreateWithoutProgramsInput, UniversityUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: UniversityCreateOrConnectWithoutProgramsInput
    connect?: UniversityWhereUniqueInput
  }

  export type ProgramUpdateOneRequiredWithoutUniversitiesNestedInput = {
    create?: XOR<ProgramCreateWithoutUniversitiesInput, ProgramUncheckedCreateWithoutUniversitiesInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutUniversitiesInput
    upsert?: ProgramUpsertWithoutUniversitiesInput
    connect?: ProgramWhereUniqueInput
    update?: XOR<XOR<ProgramUpdateToOneWithWhereWithoutUniversitiesInput, ProgramUpdateWithoutUniversitiesInput>, ProgramUncheckedUpdateWithoutUniversitiesInput>
  }

  export type UniversityUpdateOneRequiredWithoutProgramsNestedInput = {
    create?: XOR<UniversityCreateWithoutProgramsInput, UniversityUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: UniversityCreateOrConnectWithoutProgramsInput
    upsert?: UniversityUpsertWithoutProgramsInput
    connect?: UniversityWhereUniqueInput
    update?: XOR<XOR<UniversityUpdateToOneWithWhereWithoutProgramsInput, UniversityUpdateWithoutProgramsInput>, UniversityUncheckedUpdateWithoutProgramsInput>
  }

  export type AuthCreateNestedOneWithoutUserInput = {
    create?: XOR<AuthCreateWithoutUserInput, AuthUncheckedCreateWithoutUserInput>
    connectOrCreate?: AuthCreateOrConnectWithoutUserInput
    connect?: AuthWhereUniqueInput
  }

  export type MockTestCreateNestedManyWithoutUserInput = {
    create?: XOR<MockTestCreateWithoutUserInput, MockTestUncheckedCreateWithoutUserInput> | MockTestCreateWithoutUserInput[] | MockTestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutUserInput | MockTestCreateOrConnectWithoutUserInput[]
    createMany?: MockTestCreateManyUserInputEnvelope
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
  }

  export type UserProgramCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgramCreateWithoutUserInput, UserProgramUncheckedCreateWithoutUserInput> | UserProgramCreateWithoutUserInput[] | UserProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutUserInput | UserProgramCreateOrConnectWithoutUserInput[]
    createMany?: UserProgramCreateManyUserInputEnvelope
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
  }

  export type UserUniversityCreateNestedManyWithoutUserInput = {
    create?: XOR<UserUniversityCreateWithoutUserInput, UserUniversityUncheckedCreateWithoutUserInput> | UserUniversityCreateWithoutUserInput[] | UserUniversityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUserInput | UserUniversityCreateOrConnectWithoutUserInput[]
    createMany?: UserUniversityCreateManyUserInputEnvelope
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
  }

  export type AuthUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<AuthCreateWithoutUserInput, AuthUncheckedCreateWithoutUserInput>
    connectOrCreate?: AuthCreateOrConnectWithoutUserInput
    connect?: AuthWhereUniqueInput
  }

  export type MockTestUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MockTestCreateWithoutUserInput, MockTestUncheckedCreateWithoutUserInput> | MockTestCreateWithoutUserInput[] | MockTestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutUserInput | MockTestCreateOrConnectWithoutUserInput[]
    createMany?: MockTestCreateManyUserInputEnvelope
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
  }

  export type UserProgramUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgramCreateWithoutUserInput, UserProgramUncheckedCreateWithoutUserInput> | UserProgramCreateWithoutUserInput[] | UserProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutUserInput | UserProgramCreateOrConnectWithoutUserInput[]
    createMany?: UserProgramCreateManyUserInputEnvelope
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
  }

  export type UserUniversityUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserUniversityCreateWithoutUserInput, UserUniversityUncheckedCreateWithoutUserInput> | UserUniversityCreateWithoutUserInput[] | UserUniversityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUserInput | UserUniversityCreateOrConnectWithoutUserInput[]
    createMany?: UserUniversityCreateManyUserInputEnvelope
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AuthUpdateOneWithoutUserNestedInput = {
    create?: XOR<AuthCreateWithoutUserInput, AuthUncheckedCreateWithoutUserInput>
    connectOrCreate?: AuthCreateOrConnectWithoutUserInput
    upsert?: AuthUpsertWithoutUserInput
    disconnect?: AuthWhereInput | boolean
    delete?: AuthWhereInput | boolean
    connect?: AuthWhereUniqueInput
    update?: XOR<XOR<AuthUpdateToOneWithWhereWithoutUserInput, AuthUpdateWithoutUserInput>, AuthUncheckedUpdateWithoutUserInput>
  }

  export type MockTestUpdateManyWithoutUserNestedInput = {
    create?: XOR<MockTestCreateWithoutUserInput, MockTestUncheckedCreateWithoutUserInput> | MockTestCreateWithoutUserInput[] | MockTestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutUserInput | MockTestCreateOrConnectWithoutUserInput[]
    upsert?: MockTestUpsertWithWhereUniqueWithoutUserInput | MockTestUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MockTestCreateManyUserInputEnvelope
    set?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    disconnect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    delete?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    update?: MockTestUpdateWithWhereUniqueWithoutUserInput | MockTestUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MockTestUpdateManyWithWhereWithoutUserInput | MockTestUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MockTestScalarWhereInput | MockTestScalarWhereInput[]
  }

  export type UserProgramUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgramCreateWithoutUserInput, UserProgramUncheckedCreateWithoutUserInput> | UserProgramCreateWithoutUserInput[] | UserProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutUserInput | UserProgramCreateOrConnectWithoutUserInput[]
    upsert?: UserProgramUpsertWithWhereUniqueWithoutUserInput | UserProgramUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgramCreateManyUserInputEnvelope
    set?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    disconnect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    delete?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    update?: UserProgramUpdateWithWhereUniqueWithoutUserInput | UserProgramUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgramUpdateManyWithWhereWithoutUserInput | UserProgramUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgramScalarWhereInput | UserProgramScalarWhereInput[]
  }

  export type UserUniversityUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserUniversityCreateWithoutUserInput, UserUniversityUncheckedCreateWithoutUserInput> | UserUniversityCreateWithoutUserInput[] | UserUniversityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUserInput | UserUniversityCreateOrConnectWithoutUserInput[]
    upsert?: UserUniversityUpsertWithWhereUniqueWithoutUserInput | UserUniversityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserUniversityCreateManyUserInputEnvelope
    set?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    disconnect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    delete?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    update?: UserUniversityUpdateWithWhereUniqueWithoutUserInput | UserUniversityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserUniversityUpdateManyWithWhereWithoutUserInput | UserUniversityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserUniversityScalarWhereInput | UserUniversityScalarWhereInput[]
  }

  export type AuthUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<AuthCreateWithoutUserInput, AuthUncheckedCreateWithoutUserInput>
    connectOrCreate?: AuthCreateOrConnectWithoutUserInput
    upsert?: AuthUpsertWithoutUserInput
    disconnect?: AuthWhereInput | boolean
    delete?: AuthWhereInput | boolean
    connect?: AuthWhereUniqueInput
    update?: XOR<XOR<AuthUpdateToOneWithWhereWithoutUserInput, AuthUpdateWithoutUserInput>, AuthUncheckedUpdateWithoutUserInput>
  }

  export type MockTestUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MockTestCreateWithoutUserInput, MockTestUncheckedCreateWithoutUserInput> | MockTestCreateWithoutUserInput[] | MockTestUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MockTestCreateOrConnectWithoutUserInput | MockTestCreateOrConnectWithoutUserInput[]
    upsert?: MockTestUpsertWithWhereUniqueWithoutUserInput | MockTestUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MockTestCreateManyUserInputEnvelope
    set?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    disconnect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    delete?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    connect?: MockTestWhereUniqueInput | MockTestWhereUniqueInput[]
    update?: MockTestUpdateWithWhereUniqueWithoutUserInput | MockTestUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MockTestUpdateManyWithWhereWithoutUserInput | MockTestUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MockTestScalarWhereInput | MockTestScalarWhereInput[]
  }

  export type UserProgramUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgramCreateWithoutUserInput, UserProgramUncheckedCreateWithoutUserInput> | UserProgramCreateWithoutUserInput[] | UserProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgramCreateOrConnectWithoutUserInput | UserProgramCreateOrConnectWithoutUserInput[]
    upsert?: UserProgramUpsertWithWhereUniqueWithoutUserInput | UserProgramUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgramCreateManyUserInputEnvelope
    set?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    disconnect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    delete?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    connect?: UserProgramWhereUniqueInput | UserProgramWhereUniqueInput[]
    update?: UserProgramUpdateWithWhereUniqueWithoutUserInput | UserProgramUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgramUpdateManyWithWhereWithoutUserInput | UserProgramUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgramScalarWhereInput | UserProgramScalarWhereInput[]
  }

  export type UserUniversityUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserUniversityCreateWithoutUserInput, UserUniversityUncheckedCreateWithoutUserInput> | UserUniversityCreateWithoutUserInput[] | UserUniversityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserUniversityCreateOrConnectWithoutUserInput | UserUniversityCreateOrConnectWithoutUserInput[]
    upsert?: UserUniversityUpsertWithWhereUniqueWithoutUserInput | UserUniversityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserUniversityCreateManyUserInputEnvelope
    set?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    disconnect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    delete?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    connect?: UserUniversityWhereUniqueInput | UserUniversityWhereUniqueInput[]
    update?: UserUniversityUpdateWithWhereUniqueWithoutUserInput | UserUniversityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserUniversityUpdateManyWithWhereWithoutUserInput | UserUniversityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserUniversityScalarWhereInput | UserUniversityScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAuthInput = {
    create?: XOR<UserCreateWithoutAuthInput, UserUncheckedCreateWithoutAuthInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAuthNestedInput = {
    create?: XOR<UserCreateWithoutAuthInput, UserUncheckedCreateWithoutAuthInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthInput
    upsert?: UserUpsertWithoutAuthInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuthInput, UserUpdateWithoutAuthInput>, UserUncheckedUpdateWithoutAuthInput>
  }

  export type UserCreateNestedOneWithoutSavedProgramsInput = {
    create?: XOR<UserCreateWithoutSavedProgramsInput, UserUncheckedCreateWithoutSavedProgramsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedProgramsInput
    connect?: UserWhereUniqueInput
  }

  export type ProgramCreateNestedOneWithoutUserProgramsInput = {
    create?: XOR<ProgramCreateWithoutUserProgramsInput, ProgramUncheckedCreateWithoutUserProgramsInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutUserProgramsInput
    connect?: ProgramWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSavedProgramsNestedInput = {
    create?: XOR<UserCreateWithoutSavedProgramsInput, UserUncheckedCreateWithoutSavedProgramsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedProgramsInput
    upsert?: UserUpsertWithoutSavedProgramsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSavedProgramsInput, UserUpdateWithoutSavedProgramsInput>, UserUncheckedUpdateWithoutSavedProgramsInput>
  }

  export type ProgramUpdateOneRequiredWithoutUserProgramsNestedInput = {
    create?: XOR<ProgramCreateWithoutUserProgramsInput, ProgramUncheckedCreateWithoutUserProgramsInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutUserProgramsInput
    upsert?: ProgramUpsertWithoutUserProgramsInput
    connect?: ProgramWhereUniqueInput
    update?: XOR<XOR<ProgramUpdateToOneWithWhereWithoutUserProgramsInput, ProgramUpdateWithoutUserProgramsInput>, ProgramUncheckedUpdateWithoutUserProgramsInput>
  }

  export type UserCreateNestedOneWithoutSavedUniversitiesInput = {
    create?: XOR<UserCreateWithoutSavedUniversitiesInput, UserUncheckedCreateWithoutSavedUniversitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedUniversitiesInput
    connect?: UserWhereUniqueInput
  }

  export type UniversityCreateNestedOneWithoutUsersSavedInput = {
    create?: XOR<UniversityCreateWithoutUsersSavedInput, UniversityUncheckedCreateWithoutUsersSavedInput>
    connectOrCreate?: UniversityCreateOrConnectWithoutUsersSavedInput
    connect?: UniversityWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSavedUniversitiesNestedInput = {
    create?: XOR<UserCreateWithoutSavedUniversitiesInput, UserUncheckedCreateWithoutSavedUniversitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedUniversitiesInput
    upsert?: UserUpsertWithoutSavedUniversitiesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSavedUniversitiesInput, UserUpdateWithoutSavedUniversitiesInput>, UserUncheckedUpdateWithoutSavedUniversitiesInput>
  }

  export type UniversityUpdateOneRequiredWithoutUsersSavedNestedInput = {
    create?: XOR<UniversityCreateWithoutUsersSavedInput, UniversityUncheckedCreateWithoutUsersSavedInput>
    connectOrCreate?: UniversityCreateOrConnectWithoutUsersSavedInput
    upsert?: UniversityUpsertWithoutUsersSavedInput
    connect?: UniversityWhereUniqueInput
    update?: XOR<XOR<UniversityUpdateToOneWithWhereWithoutUsersSavedInput, UniversityUpdateWithoutUsersSavedInput>, UniversityUncheckedUpdateWithoutUsersSavedInput>
  }

  export type UserCreateNestedOneWithoutMockTestsInput = {
    create?: XOR<UserCreateWithoutMockTestsInput, UserUncheckedCreateWithoutMockTestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMockTestsInput
    connect?: UserWhereUniqueInput
  }

  export type ProgramCreateNestedOneWithoutMockTestsInput = {
    create?: XOR<ProgramCreateWithoutMockTestsInput, ProgramUncheckedCreateWithoutMockTestsInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutMockTestsInput
    connect?: ProgramWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMockTestsNestedInput = {
    create?: XOR<UserCreateWithoutMockTestsInput, UserUncheckedCreateWithoutMockTestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMockTestsInput
    upsert?: UserUpsertWithoutMockTestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMockTestsInput, UserUpdateWithoutMockTestsInput>, UserUncheckedUpdateWithoutMockTestsInput>
  }

  export type ProgramUpdateOneRequiredWithoutMockTestsNestedInput = {
    create?: XOR<ProgramCreateWithoutMockTestsInput, ProgramUncheckedCreateWithoutMockTestsInput>
    connectOrCreate?: ProgramCreateOrConnectWithoutMockTestsInput
    upsert?: ProgramUpsertWithoutMockTestsInput
    connect?: ProgramWhereUniqueInput
    update?: XOR<XOR<ProgramUpdateToOneWithWhereWithoutMockTestsInput, ProgramUpdateWithoutMockTestsInput>, ProgramUncheckedUpdateWithoutMockTestsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProgramUniversityCreateWithoutUniversityInput = {
    program: ProgramCreateNestedOneWithoutUniversitiesInput
  }

  export type ProgramUniversityUncheckedCreateWithoutUniversityInput = {
    programId: string
  }

  export type ProgramUniversityCreateOrConnectWithoutUniversityInput = {
    where: ProgramUniversityWhereUniqueInput
    create: XOR<ProgramUniversityCreateWithoutUniversityInput, ProgramUniversityUncheckedCreateWithoutUniversityInput>
  }

  export type ProgramUniversityCreateManyUniversityInputEnvelope = {
    data: ProgramUniversityCreateManyUniversityInput | ProgramUniversityCreateManyUniversityInput[]
    skipDuplicates?: boolean
  }

  export type UniversityLocationCreateWithoutUniversityInput = {
    id?: string
    code: string
    name: string
  }

  export type UniversityLocationUncheckedCreateWithoutUniversityInput = {
    id?: string
    code: string
    name: string
  }

  export type UniversityLocationCreateOrConnectWithoutUniversityInput = {
    where: UniversityLocationWhereUniqueInput
    create: XOR<UniversityLocationCreateWithoutUniversityInput, UniversityLocationUncheckedCreateWithoutUniversityInput>
  }

  export type UniversityLocationCreateManyUniversityInputEnvelope = {
    data: UniversityLocationCreateManyUniversityInput | UniversityLocationCreateManyUniversityInput[]
    skipDuplicates?: boolean
  }

  export type UserUniversityCreateWithoutUniversityInput = {
    id?: string
    notes?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSavedUniversitiesInput
  }

  export type UserUniversityUncheckedCreateWithoutUniversityInput = {
    id?: string
    userId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type UserUniversityCreateOrConnectWithoutUniversityInput = {
    where: UserUniversityWhereUniqueInput
    create: XOR<UserUniversityCreateWithoutUniversityInput, UserUniversityUncheckedCreateWithoutUniversityInput>
  }

  export type UserUniversityCreateManyUniversityInputEnvelope = {
    data: UserUniversityCreateManyUniversityInput | UserUniversityCreateManyUniversityInput[]
    skipDuplicates?: boolean
  }

  export type ProgramUniversityUpsertWithWhereUniqueWithoutUniversityInput = {
    where: ProgramUniversityWhereUniqueInput
    update: XOR<ProgramUniversityUpdateWithoutUniversityInput, ProgramUniversityUncheckedUpdateWithoutUniversityInput>
    create: XOR<ProgramUniversityCreateWithoutUniversityInput, ProgramUniversityUncheckedCreateWithoutUniversityInput>
  }

  export type ProgramUniversityUpdateWithWhereUniqueWithoutUniversityInput = {
    where: ProgramUniversityWhereUniqueInput
    data: XOR<ProgramUniversityUpdateWithoutUniversityInput, ProgramUniversityUncheckedUpdateWithoutUniversityInput>
  }

  export type ProgramUniversityUpdateManyWithWhereWithoutUniversityInput = {
    where: ProgramUniversityScalarWhereInput
    data: XOR<ProgramUniversityUpdateManyMutationInput, ProgramUniversityUncheckedUpdateManyWithoutUniversityInput>
  }

  export type ProgramUniversityScalarWhereInput = {
    AND?: ProgramUniversityScalarWhereInput | ProgramUniversityScalarWhereInput[]
    OR?: ProgramUniversityScalarWhereInput[]
    NOT?: ProgramUniversityScalarWhereInput | ProgramUniversityScalarWhereInput[]
    programId?: StringFilter<"ProgramUniversity"> | string
    universityId?: StringFilter<"ProgramUniversity"> | string
  }

  export type UniversityLocationUpsertWithWhereUniqueWithoutUniversityInput = {
    where: UniversityLocationWhereUniqueInput
    update: XOR<UniversityLocationUpdateWithoutUniversityInput, UniversityLocationUncheckedUpdateWithoutUniversityInput>
    create: XOR<UniversityLocationCreateWithoutUniversityInput, UniversityLocationUncheckedCreateWithoutUniversityInput>
  }

  export type UniversityLocationUpdateWithWhereUniqueWithoutUniversityInput = {
    where: UniversityLocationWhereUniqueInput
    data: XOR<UniversityLocationUpdateWithoutUniversityInput, UniversityLocationUncheckedUpdateWithoutUniversityInput>
  }

  export type UniversityLocationUpdateManyWithWhereWithoutUniversityInput = {
    where: UniversityLocationScalarWhereInput
    data: XOR<UniversityLocationUpdateManyMutationInput, UniversityLocationUncheckedUpdateManyWithoutUniversityInput>
  }

  export type UniversityLocationScalarWhereInput = {
    AND?: UniversityLocationScalarWhereInput | UniversityLocationScalarWhereInput[]
    OR?: UniversityLocationScalarWhereInput[]
    NOT?: UniversityLocationScalarWhereInput | UniversityLocationScalarWhereInput[]
    id?: StringFilter<"UniversityLocation"> | string
    universityId?: StringFilter<"UniversityLocation"> | string
    code?: StringFilter<"UniversityLocation"> | string
    name?: StringFilter<"UniversityLocation"> | string
  }

  export type UserUniversityUpsertWithWhereUniqueWithoutUniversityInput = {
    where: UserUniversityWhereUniqueInput
    update: XOR<UserUniversityUpdateWithoutUniversityInput, UserUniversityUncheckedUpdateWithoutUniversityInput>
    create: XOR<UserUniversityCreateWithoutUniversityInput, UserUniversityUncheckedCreateWithoutUniversityInput>
  }

  export type UserUniversityUpdateWithWhereUniqueWithoutUniversityInput = {
    where: UserUniversityWhereUniqueInput
    data: XOR<UserUniversityUpdateWithoutUniversityInput, UserUniversityUncheckedUpdateWithoutUniversityInput>
  }

  export type UserUniversityUpdateManyWithWhereWithoutUniversityInput = {
    where: UserUniversityScalarWhereInput
    data: XOR<UserUniversityUpdateManyMutationInput, UserUniversityUncheckedUpdateManyWithoutUniversityInput>
  }

  export type UserUniversityScalarWhereInput = {
    AND?: UserUniversityScalarWhereInput | UserUniversityScalarWhereInput[]
    OR?: UserUniversityScalarWhereInput[]
    NOT?: UserUniversityScalarWhereInput | UserUniversityScalarWhereInput[]
    id?: StringFilter<"UserUniversity"> | string
    userId?: StringFilter<"UserUniversity"> | string
    universityId?: StringFilter<"UserUniversity"> | string
    notes?: StringNullableFilter<"UserUniversity"> | string | null
    createdAt?: DateTimeFilter<"UserUniversity"> | Date | string
  }

  export type UniversityCreateWithoutLocationsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramUniversityCreateNestedManyWithoutUniversityInput
    usersSaved?: UserUniversityCreateNestedManyWithoutUniversityInput
  }

  export type UniversityUncheckedCreateWithoutLocationsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramUniversityUncheckedCreateNestedManyWithoutUniversityInput
    usersSaved?: UserUniversityUncheckedCreateNestedManyWithoutUniversityInput
  }

  export type UniversityCreateOrConnectWithoutLocationsInput = {
    where: UniversityWhereUniqueInput
    create: XOR<UniversityCreateWithoutLocationsInput, UniversityUncheckedCreateWithoutLocationsInput>
  }

  export type UniversityUpsertWithoutLocationsInput = {
    update: XOR<UniversityUpdateWithoutLocationsInput, UniversityUncheckedUpdateWithoutLocationsInput>
    create: XOR<UniversityCreateWithoutLocationsInput, UniversityUncheckedCreateWithoutLocationsInput>
    where?: UniversityWhereInput
  }

  export type UniversityUpdateToOneWithWhereWithoutLocationsInput = {
    where?: UniversityWhereInput
    data: XOR<UniversityUpdateWithoutLocationsInput, UniversityUncheckedUpdateWithoutLocationsInput>
  }

  export type UniversityUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUniversityUpdateManyWithoutUniversityNestedInput
    usersSaved?: UserUniversityUpdateManyWithoutUniversityNestedInput
  }

  export type UniversityUncheckedUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUniversityUncheckedUpdateManyWithoutUniversityNestedInput
    usersSaved?: UserUniversityUncheckedUpdateManyWithoutUniversityNestedInput
  }

  export type ProgramUniversityCreateWithoutProgramInput = {
    university: UniversityCreateNestedOneWithoutProgramsInput
  }

  export type ProgramUniversityUncheckedCreateWithoutProgramInput = {
    universityId: string
  }

  export type ProgramUniversityCreateOrConnectWithoutProgramInput = {
    where: ProgramUniversityWhereUniqueInput
    create: XOR<ProgramUniversityCreateWithoutProgramInput, ProgramUniversityUncheckedCreateWithoutProgramInput>
  }

  export type ProgramUniversityCreateManyProgramInputEnvelope = {
    data: ProgramUniversityCreateManyProgramInput | ProgramUniversityCreateManyProgramInput[]
    skipDuplicates?: boolean
  }

  export type UserProgramCreateWithoutProgramInput = {
    id?: string
    status?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSavedProgramsInput
  }

  export type UserProgramUncheckedCreateWithoutProgramInput = {
    id?: string
    userId: string
    status?: string | null
    createdAt?: Date | string
  }

  export type UserProgramCreateOrConnectWithoutProgramInput = {
    where: UserProgramWhereUniqueInput
    create: XOR<UserProgramCreateWithoutProgramInput, UserProgramUncheckedCreateWithoutProgramInput>
  }

  export type UserProgramCreateManyProgramInputEnvelope = {
    data: UserProgramCreateManyProgramInput | UserProgramCreateManyProgramInput[]
    skipDuplicates?: boolean
  }

  export type MockTestCreateWithoutProgramInput = {
    id?: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMockTestsInput
  }

  export type MockTestUncheckedCreateWithoutProgramInput = {
    id?: string
    userId: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MockTestCreateOrConnectWithoutProgramInput = {
    where: MockTestWhereUniqueInput
    create: XOR<MockTestCreateWithoutProgramInput, MockTestUncheckedCreateWithoutProgramInput>
  }

  export type MockTestCreateManyProgramInputEnvelope = {
    data: MockTestCreateManyProgramInput | MockTestCreateManyProgramInput[]
    skipDuplicates?: boolean
  }

  export type ProgramUniversityUpsertWithWhereUniqueWithoutProgramInput = {
    where: ProgramUniversityWhereUniqueInput
    update: XOR<ProgramUniversityUpdateWithoutProgramInput, ProgramUniversityUncheckedUpdateWithoutProgramInput>
    create: XOR<ProgramUniversityCreateWithoutProgramInput, ProgramUniversityUncheckedCreateWithoutProgramInput>
  }

  export type ProgramUniversityUpdateWithWhereUniqueWithoutProgramInput = {
    where: ProgramUniversityWhereUniqueInput
    data: XOR<ProgramUniversityUpdateWithoutProgramInput, ProgramUniversityUncheckedUpdateWithoutProgramInput>
  }

  export type ProgramUniversityUpdateManyWithWhereWithoutProgramInput = {
    where: ProgramUniversityScalarWhereInput
    data: XOR<ProgramUniversityUpdateManyMutationInput, ProgramUniversityUncheckedUpdateManyWithoutProgramInput>
  }

  export type UserProgramUpsertWithWhereUniqueWithoutProgramInput = {
    where: UserProgramWhereUniqueInput
    update: XOR<UserProgramUpdateWithoutProgramInput, UserProgramUncheckedUpdateWithoutProgramInput>
    create: XOR<UserProgramCreateWithoutProgramInput, UserProgramUncheckedCreateWithoutProgramInput>
  }

  export type UserProgramUpdateWithWhereUniqueWithoutProgramInput = {
    where: UserProgramWhereUniqueInput
    data: XOR<UserProgramUpdateWithoutProgramInput, UserProgramUncheckedUpdateWithoutProgramInput>
  }

  export type UserProgramUpdateManyWithWhereWithoutProgramInput = {
    where: UserProgramScalarWhereInput
    data: XOR<UserProgramUpdateManyMutationInput, UserProgramUncheckedUpdateManyWithoutProgramInput>
  }

  export type UserProgramScalarWhereInput = {
    AND?: UserProgramScalarWhereInput | UserProgramScalarWhereInput[]
    OR?: UserProgramScalarWhereInput[]
    NOT?: UserProgramScalarWhereInput | UserProgramScalarWhereInput[]
    id?: StringFilter<"UserProgram"> | string
    userId?: StringFilter<"UserProgram"> | string
    programId?: StringFilter<"UserProgram"> | string
    status?: StringNullableFilter<"UserProgram"> | string | null
    createdAt?: DateTimeFilter<"UserProgram"> | Date | string
  }

  export type MockTestUpsertWithWhereUniqueWithoutProgramInput = {
    where: MockTestWhereUniqueInput
    update: XOR<MockTestUpdateWithoutProgramInput, MockTestUncheckedUpdateWithoutProgramInput>
    create: XOR<MockTestCreateWithoutProgramInput, MockTestUncheckedCreateWithoutProgramInput>
  }

  export type MockTestUpdateWithWhereUniqueWithoutProgramInput = {
    where: MockTestWhereUniqueInput
    data: XOR<MockTestUpdateWithoutProgramInput, MockTestUncheckedUpdateWithoutProgramInput>
  }

  export type MockTestUpdateManyWithWhereWithoutProgramInput = {
    where: MockTestScalarWhereInput
    data: XOR<MockTestUpdateManyMutationInput, MockTestUncheckedUpdateManyWithoutProgramInput>
  }

  export type MockTestScalarWhereInput = {
    AND?: MockTestScalarWhereInput | MockTestScalarWhereInput[]
    OR?: MockTestScalarWhereInput[]
    NOT?: MockTestScalarWhereInput | MockTestScalarWhereInput[]
    id?: StringFilter<"MockTest"> | string
    userId?: StringFilter<"MockTest"> | string
    programId?: StringFilter<"MockTest"> | string
    score?: IntNullableFilter<"MockTest"> | number | null
    maxScore?: IntNullableFilter<"MockTest"> | number | null
    timeTakenMinutes?: IntNullableFilter<"MockTest"> | number | null
    status?: StringFilter<"MockTest"> | string
    completedAt?: DateTimeNullableFilter<"MockTest"> | Date | string | null
    createdAt?: DateTimeFilter<"MockTest"> | Date | string
  }

  export type ProgramCreateWithoutUniversitiesInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    userPrograms?: UserProgramCreateNestedManyWithoutProgramInput
    mockTests?: MockTestCreateNestedManyWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutUniversitiesInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    userPrograms?: UserProgramUncheckedCreateNestedManyWithoutProgramInput
    mockTests?: MockTestUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutUniversitiesInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutUniversitiesInput, ProgramUncheckedCreateWithoutUniversitiesInput>
  }

  export type UniversityCreateWithoutProgramsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: UniversityLocationCreateNestedManyWithoutUniversityInput
    usersSaved?: UserUniversityCreateNestedManyWithoutUniversityInput
  }

  export type UniversityUncheckedCreateWithoutProgramsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: UniversityLocationUncheckedCreateNestedManyWithoutUniversityInput
    usersSaved?: UserUniversityUncheckedCreateNestedManyWithoutUniversityInput
  }

  export type UniversityCreateOrConnectWithoutProgramsInput = {
    where: UniversityWhereUniqueInput
    create: XOR<UniversityCreateWithoutProgramsInput, UniversityUncheckedCreateWithoutProgramsInput>
  }

  export type ProgramUpsertWithoutUniversitiesInput = {
    update: XOR<ProgramUpdateWithoutUniversitiesInput, ProgramUncheckedUpdateWithoutUniversitiesInput>
    create: XOR<ProgramCreateWithoutUniversitiesInput, ProgramUncheckedCreateWithoutUniversitiesInput>
    where?: ProgramWhereInput
  }

  export type ProgramUpdateToOneWithWhereWithoutUniversitiesInput = {
    where?: ProgramWhereInput
    data: XOR<ProgramUpdateWithoutUniversitiesInput, ProgramUncheckedUpdateWithoutUniversitiesInput>
  }

  export type ProgramUpdateWithoutUniversitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userPrograms?: UserProgramUpdateManyWithoutProgramNestedInput
    mockTests?: MockTestUpdateManyWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutUniversitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userPrograms?: UserProgramUncheckedUpdateManyWithoutProgramNestedInput
    mockTests?: MockTestUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type UniversityUpsertWithoutProgramsInput = {
    update: XOR<UniversityUpdateWithoutProgramsInput, UniversityUncheckedUpdateWithoutProgramsInput>
    create: XOR<UniversityCreateWithoutProgramsInput, UniversityUncheckedCreateWithoutProgramsInput>
    where?: UniversityWhereInput
  }

  export type UniversityUpdateToOneWithWhereWithoutProgramsInput = {
    where?: UniversityWhereInput
    data: XOR<UniversityUpdateWithoutProgramsInput, UniversityUncheckedUpdateWithoutProgramsInput>
  }

  export type UniversityUpdateWithoutProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: UniversityLocationUpdateManyWithoutUniversityNestedInput
    usersSaved?: UserUniversityUpdateManyWithoutUniversityNestedInput
  }

  export type UniversityUncheckedUpdateWithoutProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: UniversityLocationUncheckedUpdateManyWithoutUniversityNestedInput
    usersSaved?: UserUniversityUncheckedUpdateManyWithoutUniversityNestedInput
  }

  export type AuthCreateWithoutUserInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AuthUncheckedCreateWithoutUserInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type AuthCreateOrConnectWithoutUserInput = {
    where: AuthWhereUniqueInput
    create: XOR<AuthCreateWithoutUserInput, AuthUncheckedCreateWithoutUserInput>
  }

  export type MockTestCreateWithoutUserInput = {
    id?: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
    program: ProgramCreateNestedOneWithoutMockTestsInput
  }

  export type MockTestUncheckedCreateWithoutUserInput = {
    id?: string
    programId: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MockTestCreateOrConnectWithoutUserInput = {
    where: MockTestWhereUniqueInput
    create: XOR<MockTestCreateWithoutUserInput, MockTestUncheckedCreateWithoutUserInput>
  }

  export type MockTestCreateManyUserInputEnvelope = {
    data: MockTestCreateManyUserInput | MockTestCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserProgramCreateWithoutUserInput = {
    id?: string
    status?: string | null
    createdAt?: Date | string
    program: ProgramCreateNestedOneWithoutUserProgramsInput
  }

  export type UserProgramUncheckedCreateWithoutUserInput = {
    id?: string
    programId: string
    status?: string | null
    createdAt?: Date | string
  }

  export type UserProgramCreateOrConnectWithoutUserInput = {
    where: UserProgramWhereUniqueInput
    create: XOR<UserProgramCreateWithoutUserInput, UserProgramUncheckedCreateWithoutUserInput>
  }

  export type UserProgramCreateManyUserInputEnvelope = {
    data: UserProgramCreateManyUserInput | UserProgramCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserUniversityCreateWithoutUserInput = {
    id?: string
    notes?: string | null
    createdAt?: Date | string
    university: UniversityCreateNestedOneWithoutUsersSavedInput
  }

  export type UserUniversityUncheckedCreateWithoutUserInput = {
    id?: string
    universityId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type UserUniversityCreateOrConnectWithoutUserInput = {
    where: UserUniversityWhereUniqueInput
    create: XOR<UserUniversityCreateWithoutUserInput, UserUniversityUncheckedCreateWithoutUserInput>
  }

  export type UserUniversityCreateManyUserInputEnvelope = {
    data: UserUniversityCreateManyUserInput | UserUniversityCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuthUpsertWithoutUserInput = {
    update: XOR<AuthUpdateWithoutUserInput, AuthUncheckedUpdateWithoutUserInput>
    create: XOR<AuthCreateWithoutUserInput, AuthUncheckedCreateWithoutUserInput>
    where?: AuthWhereInput
  }

  export type AuthUpdateToOneWithWhereWithoutUserInput = {
    where?: AuthWhereInput
    data: XOR<AuthUpdateWithoutUserInput, AuthUncheckedUpdateWithoutUserInput>
  }

  export type AuthUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestUpsertWithWhereUniqueWithoutUserInput = {
    where: MockTestWhereUniqueInput
    update: XOR<MockTestUpdateWithoutUserInput, MockTestUncheckedUpdateWithoutUserInput>
    create: XOR<MockTestCreateWithoutUserInput, MockTestUncheckedCreateWithoutUserInput>
  }

  export type MockTestUpdateWithWhereUniqueWithoutUserInput = {
    where: MockTestWhereUniqueInput
    data: XOR<MockTestUpdateWithoutUserInput, MockTestUncheckedUpdateWithoutUserInput>
  }

  export type MockTestUpdateManyWithWhereWithoutUserInput = {
    where: MockTestScalarWhereInput
    data: XOR<MockTestUpdateManyMutationInput, MockTestUncheckedUpdateManyWithoutUserInput>
  }

  export type UserProgramUpsertWithWhereUniqueWithoutUserInput = {
    where: UserProgramWhereUniqueInput
    update: XOR<UserProgramUpdateWithoutUserInput, UserProgramUncheckedUpdateWithoutUserInput>
    create: XOR<UserProgramCreateWithoutUserInput, UserProgramUncheckedCreateWithoutUserInput>
  }

  export type UserProgramUpdateWithWhereUniqueWithoutUserInput = {
    where: UserProgramWhereUniqueInput
    data: XOR<UserProgramUpdateWithoutUserInput, UserProgramUncheckedUpdateWithoutUserInput>
  }

  export type UserProgramUpdateManyWithWhereWithoutUserInput = {
    where: UserProgramScalarWhereInput
    data: XOR<UserProgramUpdateManyMutationInput, UserProgramUncheckedUpdateManyWithoutUserInput>
  }

  export type UserUniversityUpsertWithWhereUniqueWithoutUserInput = {
    where: UserUniversityWhereUniqueInput
    update: XOR<UserUniversityUpdateWithoutUserInput, UserUniversityUncheckedUpdateWithoutUserInput>
    create: XOR<UserUniversityCreateWithoutUserInput, UserUniversityUncheckedCreateWithoutUserInput>
  }

  export type UserUniversityUpdateWithWhereUniqueWithoutUserInput = {
    where: UserUniversityWhereUniqueInput
    data: XOR<UserUniversityUpdateWithoutUserInput, UserUniversityUncheckedUpdateWithoutUserInput>
  }

  export type UserUniversityUpdateManyWithWhereWithoutUserInput = {
    where: UserUniversityScalarWhereInput
    data: XOR<UserUniversityUpdateManyMutationInput, UserUniversityUncheckedUpdateManyWithoutUserInput>
  }

  export type UserCreateWithoutAuthInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    mockTests?: MockTestCreateNestedManyWithoutUserInput
    savedPrograms?: UserProgramCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuthInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    mockTests?: MockTestUncheckedCreateNestedManyWithoutUserInput
    savedPrograms?: UserProgramUncheckedCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuthInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuthInput, UserUncheckedCreateWithoutAuthInput>
  }

  export type UserUpsertWithoutAuthInput = {
    update: XOR<UserUpdateWithoutAuthInput, UserUncheckedUpdateWithoutAuthInput>
    create: XOR<UserCreateWithoutAuthInput, UserUncheckedCreateWithoutAuthInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuthInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuthInput, UserUncheckedUpdateWithoutAuthInput>
  }

  export type UserUpdateWithoutAuthInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mockTests?: MockTestUpdateManyWithoutUserNestedInput
    savedPrograms?: UserProgramUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuthInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mockTests?: MockTestUncheckedUpdateManyWithoutUserNestedInput
    savedPrograms?: UserProgramUncheckedUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSavedProgramsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthCreateNestedOneWithoutUserInput
    mockTests?: MockTestCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSavedProgramsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthUncheckedCreateNestedOneWithoutUserInput
    mockTests?: MockTestUncheckedCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSavedProgramsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSavedProgramsInput, UserUncheckedCreateWithoutSavedProgramsInput>
  }

  export type ProgramCreateWithoutUserProgramsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    universities?: ProgramUniversityCreateNestedManyWithoutProgramInput
    mockTests?: MockTestCreateNestedManyWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutUserProgramsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    universities?: ProgramUniversityUncheckedCreateNestedManyWithoutProgramInput
    mockTests?: MockTestUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutUserProgramsInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutUserProgramsInput, ProgramUncheckedCreateWithoutUserProgramsInput>
  }

  export type UserUpsertWithoutSavedProgramsInput = {
    update: XOR<UserUpdateWithoutSavedProgramsInput, UserUncheckedUpdateWithoutSavedProgramsInput>
    create: XOR<UserCreateWithoutSavedProgramsInput, UserUncheckedCreateWithoutSavedProgramsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSavedProgramsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSavedProgramsInput, UserUncheckedUpdateWithoutSavedProgramsInput>
  }

  export type UserUpdateWithoutSavedProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUpdateOneWithoutUserNestedInput
    mockTests?: MockTestUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSavedProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUncheckedUpdateOneWithoutUserNestedInput
    mockTests?: MockTestUncheckedUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProgramUpsertWithoutUserProgramsInput = {
    update: XOR<ProgramUpdateWithoutUserProgramsInput, ProgramUncheckedUpdateWithoutUserProgramsInput>
    create: XOR<ProgramCreateWithoutUserProgramsInput, ProgramUncheckedCreateWithoutUserProgramsInput>
    where?: ProgramWhereInput
  }

  export type ProgramUpdateToOneWithWhereWithoutUserProgramsInput = {
    where?: ProgramWhereInput
    data: XOR<ProgramUpdateWithoutUserProgramsInput, ProgramUncheckedUpdateWithoutUserProgramsInput>
  }

  export type ProgramUpdateWithoutUserProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    universities?: ProgramUniversityUpdateManyWithoutProgramNestedInput
    mockTests?: MockTestUpdateManyWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutUserProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    universities?: ProgramUniversityUncheckedUpdateManyWithoutProgramNestedInput
    mockTests?: MockTestUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type UserCreateWithoutSavedUniversitiesInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthCreateNestedOneWithoutUserInput
    mockTests?: MockTestCreateNestedManyWithoutUserInput
    savedPrograms?: UserProgramCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSavedUniversitiesInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthUncheckedCreateNestedOneWithoutUserInput
    mockTests?: MockTestUncheckedCreateNestedManyWithoutUserInput
    savedPrograms?: UserProgramUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSavedUniversitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSavedUniversitiesInput, UserUncheckedCreateWithoutSavedUniversitiesInput>
  }

  export type UniversityCreateWithoutUsersSavedInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramUniversityCreateNestedManyWithoutUniversityInput
    locations?: UniversityLocationCreateNestedManyWithoutUniversityInput
  }

  export type UniversityUncheckedCreateWithoutUsersSavedInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    logoUrl?: string | null
    type: string
    municipality?: string | null
    website?: string | null
    email?: string | null
    studentCount?: number | null
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    programs?: ProgramUniversityUncheckedCreateNestedManyWithoutUniversityInput
    locations?: UniversityLocationUncheckedCreateNestedManyWithoutUniversityInput
  }

  export type UniversityCreateOrConnectWithoutUsersSavedInput = {
    where: UniversityWhereUniqueInput
    create: XOR<UniversityCreateWithoutUsersSavedInput, UniversityUncheckedCreateWithoutUsersSavedInput>
  }

  export type UserUpsertWithoutSavedUniversitiesInput = {
    update: XOR<UserUpdateWithoutSavedUniversitiesInput, UserUncheckedUpdateWithoutSavedUniversitiesInput>
    create: XOR<UserCreateWithoutSavedUniversitiesInput, UserUncheckedCreateWithoutSavedUniversitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSavedUniversitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSavedUniversitiesInput, UserUncheckedUpdateWithoutSavedUniversitiesInput>
  }

  export type UserUpdateWithoutSavedUniversitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUpdateOneWithoutUserNestedInput
    mockTests?: MockTestUpdateManyWithoutUserNestedInput
    savedPrograms?: UserProgramUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSavedUniversitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUncheckedUpdateOneWithoutUserNestedInput
    mockTests?: MockTestUncheckedUpdateManyWithoutUserNestedInput
    savedPrograms?: UserProgramUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UniversityUpsertWithoutUsersSavedInput = {
    update: XOR<UniversityUpdateWithoutUsersSavedInput, UniversityUncheckedUpdateWithoutUsersSavedInput>
    create: XOR<UniversityCreateWithoutUsersSavedInput, UniversityUncheckedCreateWithoutUsersSavedInput>
    where?: UniversityWhereInput
  }

  export type UniversityUpdateToOneWithWhereWithoutUsersSavedInput = {
    where?: UniversityWhereInput
    data: XOR<UniversityUpdateWithoutUsersSavedInput, UniversityUncheckedUpdateWithoutUsersSavedInput>
  }

  export type UniversityUpdateWithoutUsersSavedInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUniversityUpdateManyWithoutUniversityNestedInput
    locations?: UniversityLocationUpdateManyWithoutUniversityNestedInput
  }

  export type UniversityUncheckedUpdateWithoutUsersSavedInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    municipality?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    studentCount?: NullableIntFieldUpdateOperationsInput | number | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programs?: ProgramUniversityUncheckedUpdateManyWithoutUniversityNestedInput
    locations?: UniversityLocationUncheckedUpdateManyWithoutUniversityNestedInput
  }

  export type UserCreateWithoutMockTestsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthCreateNestedOneWithoutUserInput
    savedPrograms?: UserProgramCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMockTestsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    emailVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auth?: AuthUncheckedCreateNestedOneWithoutUserInput
    savedPrograms?: UserProgramUncheckedCreateNestedManyWithoutUserInput
    savedUniversities?: UserUniversityUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMockTestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMockTestsInput, UserUncheckedCreateWithoutMockTestsInput>
  }

  export type ProgramCreateWithoutMockTestsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    universities?: ProgramUniversityCreateNestedManyWithoutProgramInput
    userPrograms?: UserProgramCreateNestedManyWithoutProgramInput
  }

  export type ProgramUncheckedCreateWithoutMockTestsInput = {
    id?: string
    oid: string
    name: string
    description?: string | null
    type: string
    typePath?: string | null
    isDegree?: boolean
    imageUrl?: string | null
    creditsAmount?: number | null
    creditsUnit?: string | null
    eqfLevel?: string | null
    nqfLevel?: string | null
    fieldOfStudy?: string | null
    degreeTitles?: ProgramCreatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    universities?: ProgramUniversityUncheckedCreateNestedManyWithoutProgramInput
    userPrograms?: UserProgramUncheckedCreateNestedManyWithoutProgramInput
  }

  export type ProgramCreateOrConnectWithoutMockTestsInput = {
    where: ProgramWhereUniqueInput
    create: XOR<ProgramCreateWithoutMockTestsInput, ProgramUncheckedCreateWithoutMockTestsInput>
  }

  export type UserUpsertWithoutMockTestsInput = {
    update: XOR<UserUpdateWithoutMockTestsInput, UserUncheckedUpdateWithoutMockTestsInput>
    create: XOR<UserCreateWithoutMockTestsInput, UserUncheckedCreateWithoutMockTestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMockTestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMockTestsInput, UserUncheckedUpdateWithoutMockTestsInput>
  }

  export type UserUpdateWithoutMockTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUpdateOneWithoutUserNestedInput
    savedPrograms?: UserProgramUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMockTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auth?: AuthUncheckedUpdateOneWithoutUserNestedInput
    savedPrograms?: UserProgramUncheckedUpdateManyWithoutUserNestedInput
    savedUniversities?: UserUniversityUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProgramUpsertWithoutMockTestsInput = {
    update: XOR<ProgramUpdateWithoutMockTestsInput, ProgramUncheckedUpdateWithoutMockTestsInput>
    create: XOR<ProgramCreateWithoutMockTestsInput, ProgramUncheckedCreateWithoutMockTestsInput>
    where?: ProgramWhereInput
  }

  export type ProgramUpdateToOneWithWhereWithoutMockTestsInput = {
    where?: ProgramWhereInput
    data: XOR<ProgramUpdateWithoutMockTestsInput, ProgramUncheckedUpdateWithoutMockTestsInput>
  }

  export type ProgramUpdateWithoutMockTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    universities?: ProgramUniversityUpdateManyWithoutProgramNestedInput
    userPrograms?: UserProgramUpdateManyWithoutProgramNestedInput
  }

  export type ProgramUncheckedUpdateWithoutMockTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    oid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    typePath?: NullableStringFieldUpdateOperationsInput | string | null
    isDegree?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    creditsAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    creditsUnit?: NullableStringFieldUpdateOperationsInput | string | null
    eqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    nqfLevel?: NullableStringFieldUpdateOperationsInput | string | null
    fieldOfStudy?: NullableStringFieldUpdateOperationsInput | string | null
    degreeTitles?: ProgramUpdatedegreeTitlesInput | string[]
    implementations?: NullableJsonNullValueInput | InputJsonValue
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    universities?: ProgramUniversityUncheckedUpdateManyWithoutProgramNestedInput
    userPrograms?: UserProgramUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type ProgramUniversityCreateManyUniversityInput = {
    programId: string
  }

  export type UniversityLocationCreateManyUniversityInput = {
    id?: string
    code: string
    name: string
  }

  export type UserUniversityCreateManyUniversityInput = {
    id?: string
    userId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type ProgramUniversityUpdateWithoutUniversityInput = {
    program?: ProgramUpdateOneRequiredWithoutUniversitiesNestedInput
  }

  export type ProgramUniversityUncheckedUpdateWithoutUniversityInput = {
    programId?: StringFieldUpdateOperationsInput | string
  }

  export type ProgramUniversityUncheckedUpdateManyWithoutUniversityInput = {
    programId?: StringFieldUpdateOperationsInput | string
  }

  export type UniversityLocationUpdateWithoutUniversityInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UniversityLocationUncheckedUpdateWithoutUniversityInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UniversityLocationUncheckedUpdateManyWithoutUniversityInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UserUniversityUpdateWithoutUniversityInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedUniversitiesNestedInput
  }

  export type UserUniversityUncheckedUpdateWithoutUniversityInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUniversityUncheckedUpdateManyWithoutUniversityInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramUniversityCreateManyProgramInput = {
    universityId: string
  }

  export type UserProgramCreateManyProgramInput = {
    id?: string
    userId: string
    status?: string | null
    createdAt?: Date | string
  }

  export type MockTestCreateManyProgramInput = {
    id?: string
    userId: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ProgramUniversityUpdateWithoutProgramInput = {
    university?: UniversityUpdateOneRequiredWithoutProgramsNestedInput
  }

  export type ProgramUniversityUncheckedUpdateWithoutProgramInput = {
    universityId?: StringFieldUpdateOperationsInput | string
  }

  export type ProgramUniversityUncheckedUpdateManyWithoutProgramInput = {
    universityId?: StringFieldUpdateOperationsInput | string
  }

  export type UserProgramUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedProgramsNestedInput
  }

  export type UserProgramUncheckedUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgramUncheckedUpdateManyWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMockTestsNestedInput
  }

  export type MockTestUncheckedUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestUncheckedUpdateManyWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestCreateManyUserInput = {
    id?: string
    programId: string
    score?: number | null
    maxScore?: number | null
    timeTakenMinutes?: number | null
    status: string
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type UserProgramCreateManyUserInput = {
    id?: string
    programId: string
    status?: string | null
    createdAt?: Date | string
  }

  export type UserUniversityCreateManyUserInput = {
    id?: string
    universityId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type MockTestUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramUpdateOneRequiredWithoutMockTestsNestedInput
  }

  export type MockTestUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MockTestUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    maxScore?: NullableIntFieldUpdateOperationsInput | number | null
    timeTakenMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgramUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    program?: ProgramUpdateOneRequiredWithoutUserProgramsNestedInput
  }

  export type UserProgramUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgramUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    programId?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUniversityUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    university?: UniversityUpdateOneRequiredWithoutUsersSavedNestedInput
  }

  export type UserUniversityUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUniversityUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    universityId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}